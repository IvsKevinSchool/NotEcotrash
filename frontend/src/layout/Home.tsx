import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const wiggle = {
  animate: {
    rotate: [-5, 5, -5],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
  },
};

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-900 overflow-hidden text-white font-sans">
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        <svg
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="200"
            cy="150"
            r="80"
            fill="rgba(110,231,183,0.4)"
            animate={{ r: [80, 90, 80], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.circle
            cx="600"
            cy="450"
            r="120"
            fill="rgba(52,211,153,0.3)"
            animate={{ r: [120, 140, 120], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.circle
            cx="400"
            cy="300"
            r="60"
            fill="rgba(34,197,94,0.5)"
            animate={{ r: [60, 70, 60], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-20">
        {/* Texto principal */}
        <motion.div
          className="md:w-1/2"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg select-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, textShadow: "0px 0px 12px #22c55e" }}
          >
            Registro Inteligente para Agencias Recolectoras
          </motion.h1>
          <motion.p
            className="text-lg text-green-200 mb-10 leading-relaxed drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Gestiona fácilmente tus bitácoras de recolección, controla los desperdicios y mejora la eficiencia de tu equipo.
          </motion.p>
          <Link to="/login">
            <motion.button
              whileHover={{
                scale: 1.2,
                boxShadow: "0px 0px 25px rgba(34,197,94,0.9)",
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
              whileTap={{ scale: 0.95, rotate: 0 }}
              className="bg-green-500 hover:bg-green-600 px-14 py-4 rounded-full font-extrabold text-white shadow-lg transition select-none"
            >
              Iniciar Sesión
            </motion.button>
          </Link>
        </motion.div>

        {/* SVG del bote de basura más detallado, tapa fija */}
        <motion.div
          className="md:w-1/2 max-w-md select-none"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-lg"
          >
            {/* Cuerpo del bote */}
            <rect
              x="16"
              y="20"
              width="32"
              height="36"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth="2"
              rx="6"
              ry="6"
            />
            {/* Líneas verticales para detalle */}
            {[22, 28, 34, 40, 46].map((x) => (
              <line
                key={x}
                x1={x}
                y1="20"
                x2={x}
                y2="56"
                stroke="#16a34a"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}
            {/* Tapa fija */}
            <rect
              x="12"
              y="10"
              width="40"
              height="12"
              fill="#16a34a"
              stroke="#0f3d07"
              strokeWidth="2"
              rx="3"
              ry="3"
            />
            {/* Manija de la tapa */}
            <rect
              x="26"
              y="6"
              width="12"
              height="6"
              fill="#134e07"
              rx="1"
              ry="1"
            />
            {/* Ruedas detalladas */}
            <circle
              cx="24"
              cy="58"
              r="5"
              fill="#134e07"
              stroke="#16a34a"
              strokeWidth="2"
            />
            <circle
              cx="40"
              cy="58"
              r="5"
              fill="#134e07"
              stroke="#16a34a"
              strokeWidth="2"
            />
            {/* Ejes */}
            <line
              x1="19"
              y1="58"
              x2="29"
              y2="58"
              stroke="#0f3d07"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="35"
              y1="58"
              x2="45"
              y2="58"
              stroke="#0f3d07"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Sombra interior para profundidad */}
            <rect
              x="18"
              y="24"
              width="28"
              height="28"
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="4"
              rx="4"
              ry="4"
            />
          </svg>
        </motion.div>
      </div>

      {/* Sección informativa */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-green-200">
        {[
          {
            title: "Registro Fácil",
            description:
              "Captura datos de recolección y actualiza bitácoras en tiempo real desde cualquier dispositivo.",
            icon: "📝",
          },
          {
            title: "Reportes Claros",
            description:
              "Obtén estadísticas y reportes visuales para analizar el desempeño y optimizar rutas.",
            icon: "📊",
          },
          {
            title: "Comunicación Efectiva",
            description:
              "Coordina a tu equipo y comparte actualizaciones instantáneas para mejorar la eficiencia.",
            icon: "📡",
          },
        ].map(({ title, description, icon }, i) => (
          <motion.div
            key={title}
            className="bg-green-800 bg-opacity-30 rounded-xl p-8 shadow-lg backdrop-blur-md cursor-default"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.3, duration: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.1,
              rotate: [0, 3, -3, 3, 0],
              boxShadow: "0 0 20px rgba(34,197,94,0.8)",
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
          >
            <motion.div className="text-5xl mb-4 select-none" {...wiggle}>
              {icon}
            </motion.div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-green-200">{description}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <motion.footer
        className="py-8 text-center text-green-300 text-sm select-none"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        © {new Date().getFullYear()} EcoRegistro. Todos los derechos reservados.
      </motion.footer>
    </div>
  );
};

export default Home;
