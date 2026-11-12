import React, { useEffect, useState } from "react";

interface InputCantidadProps {
  valor: number;
  etiqueta: string; // texto accesible del campo
  min?: number;
  ancho?: number;
  onConfirmar: (nuevoValor: string) => void;
}

/** Input numérico que confirma el cambio al salir del campo o al presionar Enter. */
export default function InputCantidad({
  valor,
  etiqueta,
  min = 1,
  ancho = 80,
  onConfirmar,
}: InputCantidadProps) {
  const [borrador, setBorrador] = useState<string>(String(valor));

  // Si el valor real cambia desde afuera, el borrador se sincroniza
  useEffect(() => {
    setBorrador(String(valor));
  }, [valor]);

  const confirmar = () => {
    if (borrador !== String(valor)) onConfirmar(borrador);
    setBorrador(String(valor));
  };

  return (
    <input
      type="number"
      min={min}
      aria-label={etiqueta}
      value={borrador}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setBorrador(e.target.value)
      }
      onBlur={confirmar}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className="form-control form-control-sm"
      style={{ width: ancho }}
    />
  );
}
