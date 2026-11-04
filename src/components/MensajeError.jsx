export default function MensajeError({ mensaje, onReintentar }) {
    return (
        <div className="alerta alerta-error" role="alert">
        <p>{mensaje}</p>
        {onReintentar && (
            <button type="button" className="boton boton-secundario" onClick={onReintentar}>
            Reintentar
            </button>
        )}
        </div>
    )
}
