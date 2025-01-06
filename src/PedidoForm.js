import React, { useState } from "react";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    solicitante: "",
    area: "",
    motivo: "",
    items: [{ cantidad: "", detalle: "" }],
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "La fecha es requerida.";
    if (!formData.solicitante) newErrors.solicitante = "El solicitante es requerido.";
    if (!formData.area) newErrors.area = "El área es requerida.";
    if (!formData.motivo) newErrors.motivo = "El motivo es requerido.";

    let hasValidItem = false;
    const itemErrors = formData.items.map((item) => {
      const itemError = {};
      if (!item.cantidad) itemError.cantidad = "La cantidad es requerida.";
      if (!item.detalle) itemError.detalle = "El detalle es requerido.";
      if (item.cantidad && item.detalle) hasValidItem = true;
      return itemError;
    });

    if (!hasValidItem) {
      newErrors.items = "Debe haber al menos un detalle de pedido válido.";
    }

    setErrors({ ...newErrors, itemErrors }); // Guardar itemErrors por separado
    return Object.keys(newErrors).length === 0 && hasValidItem;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      formData.items.forEach((item) => {
        const googleFormData = new FormData();

        // Agregar datos comunes
        googleFormData.append("entry.1875761660", formData.date); // Fecha
        googleFormData.append("entry.1483588992", formData.solicitante); // Solicitante
        googleFormData.append("entry.1338402881", formData.area); // Área
        googleFormData.append("entry.496498328", formData.motivo); // Motivo

        // Agregar detalle específico de este pedido
        googleFormData.append("entry.133220664", item.cantidad); // Cantidad
        googleFormData.append("entry.1046393402", item.detalle); // Detalle

        fetch(
          "https://docs.google.com/forms/d/e/1FAIpQLScrS-FzHZBphV4EPEbUBrHs2lnPm_ndm_OTjhW22kcxqD2dBw/formResponse",
          {
            method: "POST",
            body: googleFormData,
            mode: "no-cors",
          }
        )
          .then(() => {
            console.log("Datos enviados a Google Forms");
          })
          .catch(() => {
            console.error("Error al enviar los datos a Google Forms");
          });
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);

      setFormData({
        date: "",
        solicitante: "",
        area: "",
        motivo: "",
        items: [{ cantidad: "", detalle: "" }],
      });
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("item")) {
      const items = [...formData.items];
      items[index][name.replace("item-", "")] = value;
      setFormData({ ...formData, items });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { cantidad: "", detalle: "" }],
    });
  };

  const removeItem = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        NHRC - Área Patrimonial y Depósito
      </h1>
      <h2 className="text-lg font-bold mb-4">Formulario de Pedido</h2>
      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          El formulario se envió correctamente.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
          />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>
        <div className="mb-4">
          <label>Solicitante</label>
          <input
            type="text"
            name="solicitante"
            value={formData.solicitante}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
          />
          {errors.solicitante && <p className="text-red-500">{errors.solicitante}</p>}
        </div>
        <div className="mb-4">
          <label>Área</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
          />
          {errors.area && <p className="text-red-500">{errors.area}</p>}
        </div>
        <div className="mb-4">
          <label>Motivo</label>
          <input
            type="text"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
          />
          {errors.motivo && <p className="text-red-500">{errors.motivo}</p>}
        </div>
        <div className="mb-4">
          <h3>Detalle de Pedido</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                name="item-cantidad"
                value={item.cantidad}
                onChange={(e) => handleChange(e, index)}
                placeholder="Cantidad"
                className="flex-1 p-2 border rounded mr-2"
              />
              <input
                type="text"
                name="item-detalle"
                value={item.detalle}
                onChange={(e) => handleChange(e, index)}
                placeholder="Detalle"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="ml-2 bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Agregar ítem
          </button>
        </div>
        {errors.items && <p className="text-red-500">{errors.items}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

