// ============================================================
// COLOR UTILS — deriva uma escala de tons a partir da cor de marca
// Garante que toda a paleta do app do Aluno seja consistente,
// qualquer que seja a cor escolhida pelo Personal.
// ============================================================

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }
  
  function rgbToHex(r, g, b) {
    const toHex = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  // Clareia uma cor misturando com branco, na proporção `amount` (0 a 1)
  function lighten(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(
      r + (255 - r) * amount,
      g + (255 - g) * amount,
      b + (255 - b) * amount
    );
  }
  
  // Escurece uma cor misturando com preto, na proporção `amount` (0 a 1)
  function darken(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
  }
  
  /**
   * Gera a escala de tons derivados da cor de marca.
   * Usada em todas as telas do Aluno para manter consistência visual
   * independente de qual cor o Personal escolher.
   */
  export function getBrandScale(brandColor) {
    return {
      brand: brandColor,
      brandDark: darken(brandColor, 0.25),
      soft: lighten(brandColor, 0.88),   // fundo de card neutro
      softer: lighten(brandColor, 0.94), // fundo mais sutil ainda, para inputs/tracks
      highlight: lighten(brandColor, 0.78), // fundo de card "destacado"
      border: lighten(brandColor, 0.7),  // borda sutil que acompanha a marca
    };
  }