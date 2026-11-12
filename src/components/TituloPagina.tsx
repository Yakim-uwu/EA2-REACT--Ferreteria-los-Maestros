import React from "react";

export default function TituloPagina({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
      {children}
    </h2>
  );
}
