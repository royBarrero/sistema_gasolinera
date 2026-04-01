import React, { useState, useMemo, useEffect } from "react";

const Bitacora = () => {
  const [registros] = useState([
    {
      id: "1001",
      usuario: "Wigmar B. (Admin)",
      accion: "UPDATE",
      modulo_afectado: "Configuración de Precios",
      descripcion: "Actualizó el precio base del Diésel a 3.74 Bs.",
      direccion_ip: "192.168.1.15",
      dispositivo: "Panel Web (Windows)",
      creado_en: "2026-03-29T14:30:00",
    },
    {
      id: "1002",
      usuario: "Melissa S. (Secretaria)",
      accion: "CREATE",
      modulo_afectado: "Gestión de Personal",
      descripcion: "Registró en el sistema al nuevo guardia de seguridad.",
      direccion_ip: "192.168.1.20",
      dispositivo: "Panel Web (Windows)",
      creado_en: "2026-03-29T14:45:00",
    },
    {
      id: "1003",
      usuario: "Oscar C. (Operador)",
      accion: "LOGIN",
      modulo_afectado: "Autenticación",
      descripcion: "Inició sesión para apertura de turno.",
      direccion_ip: "192.168.1.12",
      dispositivo: "App Móvil (Android)",
      creado_en: "2026-03-29T15:00:00",
    },
    {
      id: "1004",
      usuario: "Bryan A. (Gerente)",
      accion: "UPDATE",
      modulo_afectado: "Límites de Consumo",
      descripcion:
        "Aumentó el límite mensual del cliente corporativo (CI: 456789).",
      direccion_ip: "192.168.1.10",
      dispositivo: "App Móvil (iOS)",
      creado_en: "2026-03-29T15:12:30",
    },
  ]);

  const [busquedaLibre, setBusquedaLibre] = useState("");
  const [filtroAtributo, setFiltroAtributo] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const textoLibre = busquedaLibre.toLowerCase();
      const coincideTexto =
        registro.id.toLowerCase().includes(textoLibre) ||
        registro.usuario.toLowerCase().includes(textoLibre) ||
        registro.accion.toLowerCase().includes(textoLibre) ||
        registro.modulo_afectado.toLowerCase().includes(textoLibre) ||
        registro.descripcion.toLowerCase().includes(textoLibre) ||
        registro.direccion_ip.includes(textoLibre) ||
        registro.dispositivo.toLowerCase().includes(textoLibre);

      const coincideAtributo =
        filtroAtributo === "todos" ||
        (filtroAtributo === "web" && registro.dispositivo.includes("Web")) ||
        (filtroAtributo === "movil" &&
          registro.dispositivo.includes("Móvil")) ||
        (filtroAtributo === "create" && registro.accion === "CREATE") ||
        (filtroAtributo === "update" && registro.accion === "UPDATE") ||
        (filtroAtributo === "delete" && registro.accion === "DELETE") ||
        (filtroAtributo === "login" && registro.accion === "LOGIN");

      return coincideTexto && coincideAtributo;
    });
  }, [busquedaLibre, filtroAtributo]);

  // Reset a primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaLibre, filtroAtributo]);

  // Calcular paginación
  const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const registrosPaginados = registrosFiltrados.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getColorAccion = (accion) => {
    const colores = {
      CREATE: { bg: "#dcfce7", text: "#166534" },
      UPDATE: { bg: "#dbeafe", text: "#1e40af" },
      DELETE: { bg: "#fee2e2", text: "#991b1b" },
      LOGIN: { bg: "#f3e8ff", text: "#6b21a8" },
    };
    return colores[accion] || { bg: "#f3f4f6", text: "#374151" };
  };

  const limpiarFiltros = () => {
    setBusquedaLibre("");
    setFiltroAtributo("todos");
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "0.5rem",
            }}
          >
            📊 Bitácora de Auditoría
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Registro de movimientos del sistema
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* FILTROS */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f1f5f9",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              🔍 Filtros
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {/* Búsqueda libre */}
              <input
                type="text"
                placeholder="Buscar por cualquier dato..."
                value={busquedaLibre}
                onChange={(e) => setBusquedaLibre(e.target.value)}
                style={{
                  padding: "0.6rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />

              {/* Select por atributo */}
              <select
                value={filtroAtributo}
                onChange={(e) => setFiltroAtributo(e.target.value)}
                style={{
                  padding: "0.6rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              >
                <option value="todos">Todos los atributos</option>
                <optgroup label="Dispositivo">
                  <option value="web">🌐 Web</option>
                  <option value="movil">📱 Móvil</option>
                </optgroup>
                <optgroup label="Acción">
                  <option value="create">✨ Crear</option>
                  <option value="update">📝 Actualizar</option>
                  <option value="delete">🗑️ Eliminar</option>
                  <option value="login">🔓 Acceso</option>
                </optgroup>
              </select>

              {/* Botón limpiar */}
              <button
                onClick={limpiarFiltros}
                style={{
                  padding: "0.6rem",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  fontFamily: "inherit",
                }}
              >
                ✕ Limpiar
              </button>
            </div>
          </div>

          {/* TABLA RESPONSIVA */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#0f172a", color: "#fff" }}>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Usuario
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Acción
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      minWidth: "150px",
                    }}
                  >
                    Módulo
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      minWidth: "200px",
                    }}
                  >
                    Descripción
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Origen (IP)
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Dispositivo
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Fecha/Hora
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrosPaginados.length > 0 ? (
                  registrosPaginados.map((registro, idx) => {
                    const colorAccion = getColorAccion(registro.accion);
                    return (
                      <tr
                        key={registro.id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f1f5f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            idx % 2 === 0 ? "#fff" : "#f8fafc")
                        }
                      >
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#64748b",
                          }}
                        >
                          {registro.id}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {registro.usuario}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: colorAccion.bg,
                              color: colorAccion.text,
                              padding: "0.3rem 0.6rem",
                              borderRadius: "0.375rem",
                              fontSize: "0.7rem",
                              fontWeight: "700",
                            }}
                          >
                            {registro.accion}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: "#0f172a",
                          }}
                        >
                          {registro.modulo_afectado}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: "#475569",
                            maxWidth: "400px",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {registro.descripcion}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontFamily: "monospace",
                            color: "#4f46e5",
                            fontWeight: "500",
                          }}
                        >
                          {registro.direccion_ip}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {registro.dispositivo.includes("Móvil")
                            ? "📱 Móvil"
                            : "🌐 Web"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            fontSize: "0.8rem",
                            color: "#475569",
                          }}
                        >
                          <div>
                            {new Date(registro.creado_en).toLocaleDateString(
                              "es-BO",
                            )}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                            {new Date(registro.creado_en).toLocaleTimeString(
                              "es-BO",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "0.875rem",
                      }}
                    >
                      No hay registros que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <nav aria-label="Page navigation">
              <ul
                style={{
                  display: "flex",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  gap: "0.25rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {/* Botón Anterior */}
                <li
                  style={{
                    display: "inline-block",
                  }}
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #dee2e6",
                      backgroundColor: currentPage === 1 ? "#e9ecef" : "#fff",
                      color: currentPage === 1 ? "#6c757d" : "#0f172a",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = "#0f172a";
                        e.target.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = "#fff";
                        e.target.style.color = "#0f172a";
                      }
                    }}
                  >
                    ← Anterior
                  </button>
                </li>

                {/* Números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page} style={{ display: "inline-block" }}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          border:
                            page === currentPage
                              ? "2px solid #0f172a"
                              : "1px solid #dee2e6",
                          backgroundColor:
                            page === currentPage ? "#0f172a" : "#fff",
                          color: page === currentPage ? "#fff" : "#0f172a",
                          cursor: "pointer",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: page === currentPage ? "700" : "600",
                          minWidth: "2.5rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = "#f1f5f9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (page !== currentPage) {
                            e.target.style.backgroundColor = "#fff";
                          }
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ),
                )}

                {/* Botón Siguiente */}
                <li
                  style={{
                    display: "inline-block",
                  }}
                >
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #dee2e6",
                      backgroundColor:
                        currentPage === totalPages ? "#e9ecef" : "#fff",
                      color: currentPage === totalPages ? "#6c757d" : "#0f172a",
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = "#0f172a";
                        e.target.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = "#fff";
                        e.target.style.color = "#0f172a";
                      }
                    }}
                  >
                    Siguiente →
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* FOOTER */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f1f5f9",
              borderTop: "1px solid #e2e8f0",
              fontSize: "0.8rem",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Página{" "}
            <span style={{ fontWeight: "700", color: "#0f172a" }}>
              {currentPage}
            </span>{" "}
            de{" "}
            <span style={{ fontWeight: "700", color: "#0f172a" }}>
              {totalPages}
            </span>{" "}
            | Mostrando{" "}
            <span style={{ fontWeight: "700", color: "#0f172a" }}>
              {registrosPaginados.length}
            </span>{" "}
            de{" "}
            <span style={{ fontWeight: "700", color: "#0f172a" }}>
              {registrosFiltrados.length}
            </span>{" "}
            registros
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bitacora;
