// ============================================================
// BLUETOOTH HEART RATE — conecta a qualquer monitor BLE padrão
// (braceletes COOSPO, cintas Polar/Garmin, etc. usam o mesmo
// GATT "Heart Rate Service" 0x180D definido pelo Bluetooth SIG,
// então não precisamos de um SDK específico do fabricante)
// ============================================================

const HR_SERVICE = "heart_rate";
const HR_MEASUREMENT_CHARACTERISTIC = "heart_rate_measurement";
const BATTERY_SERVICE = "battery_service";
const BATTERY_LEVEL_CHARACTERISTIC = "battery_level";

export function isBluetoothSupported() {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

// Decodifica o payload binário da característica Heart Rate Measurement
// conforme a spec do Bluetooth SIG (flags no primeiro byte definem o formato).
function parseHeartRateValue(dataview) {
  const flags = dataview.getUint8(0);
  const is16Bit = flags & 0x1;
  const contactStatus = (flags >> 1) & 0x3;
  const energyExpendedPresent = (flags >> 3) & 0x1;
  const rrIntervalPresent = (flags >> 4) & 0x1;

  let index = 1;
  let heartRate;
  if (is16Bit) {
    heartRate = dataview.getUint16(index, true);
    index += 2;
  } else {
    heartRate = dataview.getUint8(index);
    index += 1;
  }

  let energyExpended = null;
  if (energyExpendedPresent) {
    energyExpended = dataview.getUint16(index, true); // kJ, cumulativo
    index += 2;
  }

  const rrIntervals = [];
  if (rrIntervalPresent) {
    while (index + 1 < dataview.byteLength) {
      rrIntervals.push(dataview.getUint16(index, true) / 1024); // segundos
      index += 2;
    }
  }

  return {
    heartRate,
    contactSupported: contactStatus === 2 || contactStatus === 3,
    contactDetected: contactStatus === 3,
    energyExpended,
    rrIntervals,
  };
}

export class HeartRateMonitor extends EventTarget {
  constructor() {
    super();
    this.device = null;
    this.server = null;
    this.hrChar = null;
    this._onCharValueChanged = this._onCharValueChanged.bind(this);
    this._onGattDisconnected = this._onGattDisconnected.bind(this);
  }

  async connect() {
    if (!isBluetoothSupported()) {
      throw new Error(
        "Este navegador não suporta Web Bluetooth. Use o Chrome ou Edge em um computador ou Android."
      );
    }

    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [HR_SERVICE] }],
      optionalServices: [BATTERY_SERVICE],
    });
    this.device.addEventListener("gattserverdisconnected", this._onGattDisconnected);

    this.server = await this.device.gatt.connect();
    const hrService = await this.server.getPrimaryService(HR_SERVICE);
    this.hrChar = await hrService.getCharacteristic(HR_MEASUREMENT_CHARACTERISTIC);
    await this.hrChar.startNotifications();
    this.hrChar.addEventListener("characteristicvaluechanged", this._onCharValueChanged);

    this._readBatteryLevel();

    return { name: this.device.name || "Monitor cardíaco" };
  }

  async _readBatteryLevel() {
    try {
      const battService = await this.server.getPrimaryService(BATTERY_SERVICE);
      const battChar = await battService.getCharacteristic(BATTERY_LEVEL_CHARACTERISTIC);
      const value = await battChar.readValue();
      this.dispatchEvent(new CustomEvent("battery", { detail: { level: value.getUint8(0) } }));
    } catch {
      // dispositivo não expõe nível de bateria — segue sem esse dado
    }
  }

  _onCharValueChanged(event) {
    const parsed = parseHeartRateValue(event.target.value);
    this.dispatchEvent(new CustomEvent("heartrate", { detail: parsed }));
  }

  _onGattDisconnected() {
    this.dispatchEvent(new CustomEvent("disconnected"));
  }

  disconnect() {
    if (this.hrChar) {
      this.hrChar.removeEventListener("characteristicvaluechanged", this._onCharValueChanged);
    }
    if (this.device) {
      this.device.removeEventListener("gattserverdisconnected", this._onGattDisconnected);
      if (this.device.gatt?.connected) this.device.gatt.disconnect();
    }
    this.device = null;
    this.server = null;
    this.hrChar = null;
  }
}
