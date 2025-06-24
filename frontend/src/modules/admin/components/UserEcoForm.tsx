// src/components/EcoForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import '../../../css/EcoForm.css';

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  interes: string;
  aceptaTerminos: boolean;
};

const EcoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    interes: 'informacion',
    aceptaTerminos: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div 
        className="eco-success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="eco-success-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
          </svg>
        </div>
        <h2>¡Gracias por tu interés ecológico!</h2>
        <p>Hemos recibido tu información y nos pondremos en contacto contigo pronto.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="eco-btn eco-btn-primary"
          onClick={() => {
            setSubmitSuccess(false);
            setCurrentStep(1);
            setFormData({
              nombre: '',
              email: '',
              telefono: '',
              mensaje: '',
              interes: 'informacion',
              aceptaTerminos: false,
            });
          }}
        >
          Enviar otro formulario
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="eco-form-container">
      <div className="eco-form-header">
        <h1>
          <span className="eco-leaf">🌱</span> Únete a la Revolución Verde
        </h1>
        <p>Completa este formulario para contribuir con el medio ambiente</p>
        
        <div className="eco-progress">
          <div 
            className="eco-progress-bar" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
          <div className="eco-progress-steps">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`eco-progress-step ${step <= currentStep ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="eco-form">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="eco-form-step"
          >
            <div className="eco-form-group">
              <label htmlFor="nombre" className="eco-label">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="eco-input"
                placeholder="Ej: María González"
              />
              <div className="eco-input-decoration"></div>
            </div>

            <div className="eco-form-group">
              <label htmlFor="email" className="eco-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="eco-input"
                placeholder="Ej: hola@ejemplo.com"
              />
              <div className="eco-input-decoration"></div>
            </div>

            <div className="eco-form-actions">
              <motion.button
                type="button"
                onClick={nextStep}
                className="eco-btn eco-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!formData.nombre || !formData.email}
              >
                Siguiente
                <svg viewBox="0 0 24 24" className="eco-btn-icon">
                  <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="eco-form-step"
          >
            <div className="eco-form-group">
              <label htmlFor="telefono" className="eco-label">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="eco-input"
                placeholder="Ej: +34 600 000 000"
              />
              <div className="eco-input-decoration"></div>
            </div>

            <div className="eco-form-group">
              <label htmlFor="interes" className="eco-label">
                ¿Qué te interesa?
              </label>
              <select
                id="interes"
                name="interes"
                value={formData.interes}
                onChange={handleChange}
                className="eco-select"
              >
                <option value="informacion">Información sobre ecología</option>
                <option value="voluntariado">Ser voluntario</option>
                <option value="donacion">Hacer una donación</option>
                <option value="colaboracion">Colaboración empresarial</option>
                <option value="otros">Otros</option>
              </select>
              <div className="eco-select-arrow">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                </svg>
              </div>
            </div>

            <div className="eco-form-actions">
              <motion.button
                type="button"
                onClick={prevStep}
                className="eco-btn eco-btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" className="eco-btn-icon">
                  <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                </svg>
                Anterior
              </motion.button>
              <motion.button
                type="button"
                onClick={nextStep}
                className="eco-btn eco-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Siguiente
                <svg viewBox="0 0 24 24" className="eco-btn-icon">
                  <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="eco-form-step"
          >
            <div className="eco-form-group">
              <label htmlFor="mensaje" className="eco-label">
                Tu Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className="eco-textarea"
                rows={5}
                placeholder="Cuéntanos cómo quieres contribuir al medio ambiente..."
              ></textarea>
              <div className="eco-textarea-decoration"></div>
            </div>

            <div className="eco-form-checkbox">
              <input
                type="checkbox"
                id="aceptaTerminos"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                required
                className="eco-checkbox-input"
              />
              <label htmlFor="aceptaTerminos" className="eco-checkbox-label">
                Acepto los términos y condiciones y la política de privacidad. Autorizo el tratamiento de mis datos para recibir información sobre iniciativas ecológicas.
              </label>
              <div className="eco-checkbox-checkmark">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
            </div>

            <div className="eco-form-actions">
              <motion.button
                type="button"
                onClick={prevStep}
                className="eco-btn eco-btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" className="eco-btn-icon">
                  <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                </svg>
                Anterior
              </motion.button>
              <motion.button
                type="submit"
                className="eco-btn eco-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting || !formData.aceptaTerminos}
              >
                {isSubmitting ? (
                  <>
                    <svg className="eco-spinner" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar formulario
                    <svg viewBox="0 0 24 24" className="eco-btn-icon">
                      <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>

      <div className="eco-form-footer">
        <p>
          <svg viewBox="0 0 24 24" className="eco-footer-icon">
            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17H13V7H11V17Z" />
          </svg>
          Tus datos están seguros con nosotros. No compartiremos tu información con terceros.
        </p>
      </div>
    </div>
  );
};

export default EcoForm;