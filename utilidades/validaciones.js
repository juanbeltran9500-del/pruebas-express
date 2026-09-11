function validarNombre(nombre) {
    return typeof nombre === "string" && nombre.trim().length >= 3;
}

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function generarId() {
    return Date.now();
}

module.exports = {
    validarNombre,
    validarCorreo,
    generarId
};