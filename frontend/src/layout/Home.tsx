import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-green-600">EcoApp</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-8">
                            <li><a href="#" className="text-green-700 hover:text-green-500">Inicio</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-green-500">Funciones</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-green-500">Nosotros</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-green-500">Contacto</a></li>
                        </ul>
                    </nav>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                        <Link to={'/login'}>
                            Iniciar Sesión
                        </Link>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-green-600 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">Cuida el planeta con nosotros</h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Únete a nuestra comunidad ecológica y ayuda a reducir tu huella de carbono
                    </p>
                    <div className="space-x-4">
                        <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50">
                            Comenzar ahora
                        </button>
                        <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-green-700">
                            Saber más
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Nuestras Soluciones Verdes</h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: '🌱',
                                title: 'Huella de Carbono',
                                description: 'Mide y reduce tu impacto ambiental con nuestras herramientas'
                            },
                            {
                                icon: '♻️',
                                title: 'Reciclaje Inteligente',
                                description: 'Aprende a reciclar correctamente con nuestra guía interactiva'
                            },
                            {
                                icon: '🌍',
                                title: 'Comunidad Global',
                                description: 'Conecta con otros eco-guerreros alrededor del mundo'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                                <span className="text-4xl mb-4 inline-block">{feature.icon}</span>
                                <h3 className="text-xl font-semibold text-green-600 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-green-800 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-8 md:mb-0">
                            <span className="text-2xl font-bold">EcoApp</span>
                            <p className="mt-2 max-w-xs">Juntos por un planeta más verde y sostenible</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-semibold mb-4">Enlaces</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-green-300">Inicio</a></li>
                                    <li><a href="#" className="hover:text-green-300">Nosotros</a></li>
                                    <li><a href="#" className="hover:text-green-300">Contacto</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-green-300">Privacidad</a></li>
                                    <li><a href="#" className="hover:text-green-300">Términos</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Social</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-green-300">Twitter</a></li>
                                    <li><a href="#" className="hover:text-green-300">Instagram</a></li>
                                    <li><a href="#" className="hover:text-green-300">Facebook</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-300">
                        <p>© {new Date().getFullYear()} EcoApp. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;