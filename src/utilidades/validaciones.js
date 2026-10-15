const validarNombre = (nombre) => {
    return nombre &&
           typeof nombre === 'string' &&
           nombre.trim().length >= 3;
};

const validarCorreo = (correo) => {
    if (!correo || typeof correo !== 'string') {
        return false;
    }

    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
};

// Se corrige para evaluar los campos directamente y no fallar con Multer
const validarDatos = (datos) => {
    return Boolean(datos && (datos.nombre || datos.correo));
};

const generarId = () => {
    return Date.now();
};

module.exports = {
    validarNombre,
    validarCorreo,
    validarDatos,
    generarId
};