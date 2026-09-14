// Datos de artículos para el sitio de noticias de GTA VI
// Estructura optimizada para SEO con campos para JSON-LD NewsArticle

export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // párrafos
  category: string; // slug de categoría
  author: string; // slug de autor
  publishedAt: string; // ISO date
  updatedAt?: string;
  cover: string;
  coverAlt: string;
  tags: string[];
  readingTime: number; // minutos
  featured?: boolean;
  trending?: boolean;
};

export const categories: Category[] = [
  {
    slug: "noticias",
    name: "Noticias",
    description:
      "Últimas noticias y actualizaciones oficiales sobre Grand Theft Auto VI de Rockstar Games.",
    color: "#EC4899",
  },
  {
    slug: "trailers",
    name: "Tráileres",
    description:
      "Análisis frame a frame de todos los tráileres, avances y vídeos promocionales de GTA VI.",
    color: "#06B6D4",
  },
  {
    slug: "gameplay",
    name: "Gameplay",
    description:
      "Mecánicas, sistemas de juego, mundo abierto y novedades en la jugabilidad de GTA VI.",
    color: "#A855F7",
  },
  {
    slug: "personajes",
    name: "Personajes",
    description:
      "Todo sobre Lucia, Jason y el resto del elenco de personajes de Vice City.",
    color: "#F59E0B",
  },
  {
    slug: "mapa",
    name: "Mapa y Mundo",
    description:
      "Exploración del mapa de Leonida, Vice City y todos los lugares de GTA VI.",
    color: "#10B981",
  },
  {
    slug: "rumores",
    name: "Rumores y Filtros",
    description:
      "Filtraciones, rumores y datos no confirmados sobre GTA VI, analizados con cautela.",
    color: "#EF4444",
  },
  {
    slug: "fecha-lanzamiento",
    name: "Fecha de Lanzamiento",
    description:
      "Todo lo que sabemos sobre la fecha de salida, retrasos y disponibilidad de GTA VI.",
    color: "#8B5CF6",
  },
];

export const authors: Author[] = [
  {
    slug: "carlos-mendoza",
    name: "Carlos Mendoza",
    role: "Editor Jefe",
    bio: "Periodista de videojuegos con más de 12 años cubriendo la industria. Especialista en mundos abiertos y análisis técnico. Ha seguido la saga GTA desde el primer Vice City en 2002.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    slug: "laura-vega",
    name: "Laura Vega",
    role: "Redactora Senior",
    bio: "Apasionada del storytelling y la narrativa en videojuegos. Escribe sobre personajes, lore y diseño de misiones. Anteriormente en revistas especializadas en juegos de rol.",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    slug: "diego-ramirez",
    name: "Diego Ramírez",
    role: "Analista Técnico",
    bio: "Ingeniero de software reconvertido a periodismo tecnológico. Analiza rendimiento, motores gráficos y tecnología detrás de los videojuegos AAA.",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    slug: "sofia-torres",
    name: "Sofía Torres",
    role: "Especialista en Comunidad",
    bio: "Cubre la comunidad, filtraciones, mods y cultura gamer. Conectada con foros, Discord y redes sociales para captar las conversaciones más relevantes.",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
];

export const articles: Article[] = [
  {
    slug: "rockstar-confirma-gta-vi-26-mayo-2026",
    title:
      "Rockstar Games confirma la fecha de lanzamiento de GTA VI para el 26 de mayo de 2026",
    excerpt:
      "Tras meses de especulación, Rockstar ha anunciado oficialmente que Grand Theft Auto VI llegará a PlayStation 5 y Xbox Series X|S el 26 de mayo de 2026. La versión para PC llegará más tarde.",
    content: [
      "Rockstar Games ha puesto fin a meses de intensa especulación confirmando oficialmente que Grand Theft Auto VI se lanzará el 26 de mayo de 2026 para PlayStation 5 y Xbox Series X|S. El anuncio se ha realizado mediante un comunicado en su web oficial y una publicación en las redes sociales de la compañía, acompañado de un nuevo artwork promocional que muestra a los protagonistas Lucia y Juan frente al atardecer de Vice City.",
      "La fecha, aunque posterior a la ventana originalmente prevista de primavera de 2025, encaja con los rumores que apuntaban a un retraso derivado de la complejidad técnica del proyecto y del compromiso de Rockstar con la calidad. Take-Two Interactive, matriz de Rockstar, ya advirtió en sus últimas llamadas financieras que el título se movería al año fiscal 2026, lo que fue interpretado por analistas como un indicio claro del nuevo calendario.",
      "El comunicado también confirma que la versión de PC llegará en una fecha posterior, una estrategia que Rockstar ya empleó con GTA V y Red Dead Redemption 2. Esta decisión responde, según fuentes internas, al deseo de optimizar primero la experiencia en consolas antes de abordar la diversidad hardware del ecosistema PC. Los jugadores de PC tendrán que esperar probablemente hasta 2027 para disfrutar del título.",
      "Junto al anuncio, Rockstar ha publicado un nuevo tráiler cinematográfico de un minuto que muestra escenas inéditas de gameplay, incluyendo persecuciones por la costa de Vice City, momentos íntimos entre Lucia y Juan, y secuencias de acción en un carnaval que evoca la estética de Miami. El tráiler ya ha superado los 200 millones de visualizaciones en YouTube en sus primeras 24 horas, batiendo nuevamente el récord que ya ostentaba el primer avance publicado en diciembre de 2023.",
      "Take-Two ha aprovechado el anuncio para revisar al alza sus previsiones financieras para el ejercicio 2026. Los analistas de la industria anticipan que GTA VI podría generar más de 3.200 millones de dólares en su primer año, lo que convertiría al título en el lanzamiento de entretenimiento más rentable de la historia, superando incluso los registros de su predecesor GTA V, que ha vendido más de 200 millones de copias desde 2013.",
      "Desde el punto de vista técnico, Rockstar ha confirmado que el juego aprovechará al máximo la arquitectura de las consolas de nueva generación, con un mundo abierto densamente poblado, iluminación global en tiempo real y un sistema de físicas avanzado para vehículos, NPCs y destructibilidad del entorno. El motor RAGE ha sido profundamente actualizado para dar soporte a estas características y para permitir una transición fluida entre interior y exterior sin pantallas de carga.",
      "La comunidad ha reaccionado con una mezcla de euforia y cautela. Mientras la mayoría celebra la fecha confirmada, algunos sectores recuerdan los retrasos históricos de la saga y prefieren mantener expectativas moderadas. Desde Rockstar se ha asegurado que el equipo está plenamente centrado en pulir el producto final y que no habrá más retrasos, aunque la compañía se reserva el derecho de ajustar el calendario si la calidad final lo requiere.",
    ],
    category: "fecha-lanzamiento",
    author: "carlos-mendoza",
    publishedAt: "2025-11-12T15:30:00Z",
    updatedAt: "2025-11-12T18:45:00Z",
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop",
    coverAlt:
      "Atardecer sobre Vice City con la silueta de Lucia y Juan en primer plano, arte oficial de GTA VI",
    tags: ["Rockstar Games", "Fecha de lanzamiento", "PS5", "Xbox Series", "Take-Two"],
    readingTime: 6,
    featured: true,
    trending: true,
  },
  {
    slug: "analisis-trailer-2-gta-vi-detalles-ocultos",
    title:
      "Análisis frame a frame del segundo tráiler de GTA VI: 47 detalles que se te pasaron por alto",
    excerpt:
      "Hemos revisado fotograma a fotograma el segundo tráiler de GTA VI y encontramos decenas de detalles ocultos sobre Vice City, sus personajes y las nuevas mecánicas.",
    content: [
      "El segundo tráiler de GTA VI, publicado por Rockstar Games tras el anuncio de la fecha de lanzamiento, es una mina de oro de información para los fans más observadores. A lo largo de sus 60 segundos, el estudio ha incluido decenas de guiños, detalles ambientales y pistas sobre las mecánicas que tendrá el juego. Hemos revisado cada fotograma para traerte un análisis exhaustivo.",
      "Uno de los detalles que más ha llamado la atención aparece en el segundo 12, cuando la cámara sobrevuela la costa de Vice City. En una de las playas se puede ver a un grupo de NPCs jugando al voleibol con animaciones claramente diferenciadas, lo que apunta a un sistema de IA más complejo que el de entregas anteriores. Además, las sombras dinámicas de las palmeras se proyectan con precisión sobre la arena, confirmando el uso de iluminación global en tiempo real.",
      "Otro momento clave llega en el segundo 28, durante la secuencia del carnaval. En primer plano vemos a Lucia bailando, pero si observamos el fondo podemos distinguir carteles con referencias a marcas ficticias que ya conocemos de entregas anteriores como Cluckin' Bell, Sprunk o eCola. Rockstar mantiene así su tradicional sátira del consumismo americano, y todo apunta a que el mapa incluirá localizaciones comerciales reconocibles para los veteranos de la saga.",
      "El tráiler también confirma la presencia de animales, algo que ya se intuyó en el primer avance. En el segundo 35 aparece un flamenco rosado en primer plano, y poco después podemos ver delfines saltando en el mar. Esto sugiere que la fauna será una parte importante del ecosistema de Leonida, y no sería descartable la vuelta de actividades como la caza o la pesca presentes en Red Dead Redemption 2.",
      "En el apartado de mecánicas, el segundo 41 muestra a Juan en un barco, lo que confirma que la navegación volverá a estar presente con más protagonismo que en GTA V. Las olas tienen un comportamiento realista y el barco deja una estela bien definida, indicador del nuevo sistema de físicas acuáticas. Esto abre la puerta a misiones de contrabando marítimo, algo muy acorde con la temática de Vice City.",
      "Otro detalle técnico importante: en varios planos se aprecian reflejos en tiempo real en superficies mojadas, charcos y cristales. Esto indica que Rockstar ha implementado ray tracing para reflejos, al menos de forma parcial. Combinado con la iluminación global, el resultado visual parece estar a la altura de los motores más modernos del mercado.",
      "Por último, en el segundo 52 aparece un cartel de carretera que indica la distancia a Port Gellhorn, una localidad mencionada en filtraciones previas. Esto confirma que el mapa no se limitará a Vice City, sino que incluirá varias ciudades y pueblos del estado ficticio de Leonida, ampliando considerablemente la variedad de entornos explorables.",
    ],
    category: "trailers",
    author: "diego-ramirez",
    publishedAt: "2025-11-10T09:15:00Z",
    cover:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=675&fit=crop",
    coverAlt:
      "Pantalla de análisis de tráiler de videojuego con frames y anotaciones técnicas",
    tags: ["Tráiler 2", "Análisis", "Vice City", "Detalles ocultos", "RAGE Engine"],
    readingTime: 8,
    featured: true,
    trending: true,
  },
  {
    slug: "lucia-jason-protagonistas-historia-gta-vi",
    title:
      "Lucia y Jason: todo lo que sabemos sobre los protagonistas de GTA VI",
    excerpt:
      "La saga GTA estrena por primera vez una protagonista femenina. Repasamos todo lo que sabemos sobre Lucia, Jason y la dinámica de pareja que definirá la historia de GTA VI.",
    content: [
      "Grand Theft Auto VI marcará un hito en la historia de la saga al presentar a su primera protagonista femenina en un título principal. Lucia, junto a Jason, formará la pareja criminal que protagonizará la historia, en una clara inspiración en el tropo de Bonnie y Clyde que ya se insinuaba en el primer tráiler. Esta dinámica de pareja parece ser el corazón narrativo del juego, y promete una historia más íntima y personal que las entregas anteriores.",
      "Lucia, según se desprende del primer tráiler, es una mujer latina con pasado en el sistema penitenciario. En una de las escenas más comentadas aparece saliendo de prisión, lo que sugiere que su historial criminal será un elemento central de la trama. Su personalidad parece enérgica, impulsiva y decidida, en contraste con otros personajes femeninos anteriores de la saga que solían tener roles secundarios o de apoyo.",
      "Jason, su pareja, aparenta un perfil más tranquilo y calculador. En el material mostrado hasta ahora se le ve acompañando a Lucia en diversas situaciones, desde momentos románticos hasta robos y persecuciones. La química entre ambos será fundamental para sostener la historia, y Rockstar ha insistido en que la relación de pareja será uno de los pilares emocionales del juego, algo nuevo en una franquicia que tradicionalmente ha centrado sus narrativas en individuos aislados.",
      "El casting de actores aún no ha sido confirmado oficialmente, aunque varias filtraciones apuntan a que los actores de captura de movimiento son intérpretes relativamente desconocidos, en línea con la política habitual de Rockstar de evitar estrellas reconocibles que puedan distraer de los personajes. Esta decisión permite además una mayor libertad creativa y reduce el riesgo de filtraciones de información durante el rodaje.",
      "La elección de una protagonista femenina ha generado un intenso debate en la comunidad, con reacciones mayoritariamente positivas pero también algunas críticas de sectores más conservadores. Desde Rockstar se ha defendido la decisión como una evolución natural de la saga y una respuesta a la diversidad del público actual. Fuentes internas citadas por la prensa indican que la compañía llevaba tiempo queriendo explorar una perspectiva femenina en sus historias, y que GTA VI era el contexto adecuado para hacerlo.",
      "Más allá de Lucia y Jason, el juego contará con un amplio elenco de personajes secundarios que poblarán el mundo de Vice City. Aunque Rockstar no ha revelado detalles, se espera la presencia de jefes criminales, contactos, rivales y aliados que enriquecerán las misiones y el lore del juego. La saga GTA es conocida por sus memorables personajes secundarios, y todo apunta a que esta entrega no será una excepción.",
      "La historia, según las filtraciones y los teasers, seguirá la escalada criminal de Lucia y Jason desde pequeños delitos hasta golpes mayores, con el trasfondo del mundo del narcotráfico en una Vice City inspirada en el Miami moderno. La estética, los diálogos y la música apuntan a un tono que mezcla la nostalgia de los 80 con la actualidad, en un equilibrio que Rockstar domina a la perfección.",
    ],
    category: "personajes",
    author: "laura-vega",
    publishedAt: "2025-11-08T14:00:00Z",
    cover:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe7a?w=1200&h=675&fit=crop",
    coverAlt:
      "Pareja caminando al atardecer en una ciudad costera, evocando la estética de Lucia y Jason en GTA VI",
    tags: ["Lucia", "Jason", "Personajes", "Historia", "Bonnie y Clyde"],
    readingTime: 7,
    featured: true,
  },
  {
    slug: "mapa-leonida-vice-city-tamano-gta-vi",
    title:
      "El mapa de Leonida en GTA VI: tamaño, ubicaciones y comparativa con GTA V",
    excerpt:
      "El estado ficticio de Leonida será el escenario más grande y detallado de la saga. Analizamos todas las ubicaciones confirmadas y comparamos su tamaño con Los Santos.",
    content: [
      "El mapa de Grand Theft Auto VI, ambientado en el estado ficticio de Leonida, será el más grande y detallado de toda la saga. Inspirado claramente en Florida, el escenario incluirá Vice City como principal núcleo urbano, junto con varias localidades menores, áreas rurales, humedales y una extensa costa que promete ofrecer una variedad de entornos sin precedentes en la franquicia.",
      "Vice City, la joya de la corona del mapa, está inspirada en Miami y mantendrá la estética vibrante y colorista que ya conocemos de su entrega de 2002, pero actualizada a la actualidad. Los rascacielos del downtown, las playas de Ocean Beach, los barrios cubanos de Little Havana y las zonas turísticas con hoteles y clubes nocturnos estarán presentes, junto con áreas completamente nuevas que reflejan la evolución de la ciudad real en las últimas dos décadas.",
      "Más allá de Vice City, el estado de Leonida incluirá otras ubicaciones confirmadas gracias a filtraciones y análisis de los tráileres. Port Gellhorn, mencionada en un cartel de carretera del segundo tráiler, parece ser una ciudad industrial o suburbana al norte de la metrópoli. También se han identificado áreas rurales con granjas, zonas pantanosas que evocan los Everglades, y pequeños pueblos costeros con muelles pesqueros.",
      "En cuanto al tamaño exacto, Rockstar no ha facilitado cifras oficiales, pero los análisis basados en escalas de los vehículos y la velocidad de desplazamiento sugieren que el mapa principal de GTA VI será significativamente mayor que el de GTA V. A esto hay que sumar las zonas submarinas, que en esta entrega parecen tener más profundidad y relevancia, especialmente con la confirmación de la navegación como mecánica destacada.",
      "Una de las novedades más esperadas es la densidad de población e interactividad del mundo. Los tráileres muestran calles llenas de NPCs con comportamientos variados, comercios accesibles, eventos aleatorios y una fauna diversa. Rockstar ha trabajado en un sistema de IA que promete que cada rincón del mapa se sienta vivo, con rutinas y reacciones realistas por parte de los habitantes virtuales.",
      "Otro aspecto destacado es la variedad de ecosistemas. Desde playas tropicales hasta pantanos con cocodrilos, pasando por áreas urbanas densas y zonas rurales despobladas, el mapa ofrecerá una diversidad visual y jugable que superará cualquier entrega anterior de la saga. Cada bioma tendrá su propia fauna, flora y tipo de NPCs, contribuyendo a la sensación de un mundo coherente y creíble.",
      "La comparativa con Los Santos de GTA V es inevitable. Mientras el mapa de 2013 combinaba ciudad, montaña y desierto en una proporción equilibrada, Leonida parece apostar por una mayor variedad de entornos urbanos y naturales, con Vice City como auténtico epicentro. La sensación de escala y la cantidad de actividades por metro cuadrado prometen hacer de este mapa el más rico y memorable de la saga.",
    ],
    category: "mapa",
    author: "carlos-mendoza",
    publishedAt: "2025-11-05T11:30:00Z",
    cover:
      "https://images.unsplash.com/photo-1503595855261-949655d0a1f6?w=1200&h=675&fit=crop",
    coverAlt:
      "Vista aérea de una ciudad costera tropical con playas y rascacielos, similar a Vice City",
    tags: ["Leonida", "Vice City", "Mapa", "Tamaño", "Comparativa"],
    readingTime: 7,
    trending: true,
  },
  {
    slug: "nuevas-mecanicas-gameplay-gta-vi-filtraciones",
    title:
      "Nuevas mecánicas de gameplay confirmadas para GTA VI: IA avanzada, interiores y mucho más",
    excerpt:
      "Las filtraciones y los tráileres revelan mecánicas nunca vistas en la saga: NPCs con IA inteligente, interiores sin pantallas de carga, sistemas de ropa y más.",
    content: [
      "Grand Theft Auto VI promete introducir varias mecánicas inéditas en la saga, que combinadas elevarán el listón de lo que se espera de un mundo abierto. A partir de los tráileres oficiales, las filtraciones de 2023 y las declaraciones de Rockstar, hemos podido identificar varias de las novedades jugables que traerá el título.",
      "Una de las más comentadas es el sistema de IA para NPCs. A diferencia de entregas anteriores, donde los personajes no jugadores seguían rutinas relativamente simples, en GTA VI cada NPC parecerá tener su propia vida, rutina y personalidad. Se han visto ciudadanos trabajando, socializando, reaccionando a incidentes de forma creíble e incluso desarrollando relaciones entre ellos. Esto promete un mundo mucho más inmersivo y menos predecible.",
      "Otra gran novedad es la integración fluida entre exteriores e interiores. El segundo tráiler muestra a los protagonistas entrando en locales sin pantallas de carga, lo que sugiere que muchos edificios del mapa tendrán interiores totalmente accesibles y detallados. Esto abrirá nuevas posibilidades para misiones, exploración y combate, ya que los jugadores podrán refugiarse, esconderse o acceder a objetivos a través de rutas interiores.",
      "El sistema de personalización también parece notablemente ampliado. Se han visto opciones de ropa, peinados, tatuajes y accesorios para Lucia y Juan, con una interfaz que recuerda a la de Red Dead Online pero con más profundidad. La ropa no será solo estética: según las filtraciones, afectará a las animaciones y a cómo reaccionan los NPCs ante los protagonistas, añadiendo una capa de inmersión extra.",
      "El combate, tradicionalmente uno de los puntos flojos de la saga, también recibirá mejoras. Se han visto secuencias de cobertura, tiroteos en movimiento y uso del entorno durante las persecuciones. Rockstar parece haber trabajado en hacer que las acciones se encadenen de forma más fluida, eliminando la rigidez que caracterizaba a los sistemas anteriores. También se mencionan nuevas mecánicas de sigilo y eliminación silenciosa.",
      "Los vehículos, otro pilar de la saga, recibirán un tratamiento renovado. El sistema de físicas parece más realista, con daños detallados, comportamiento diferenciado según el terreno y un modelo de conducción que promete ser más satisfactorio. Los barcos y posiblemente aviones ampliarán las opciones de desplazamiento, en consonancia con la importancia de la costa y los humedales en el mapa.",
      "Por último, todo apunta a que el modo online de GTA VI será una evolución masiva de GTA Online, con un mundo compartido, eventos dinámicos y un modelo de negocio basado en contenido continuo. Rockstar ha aprendido de los años de operación de GTA Online y promete una experiencia más equilibrada, con menos desequilibrios entre jugadores nuevos y veteranos. Los detalles concretos se conocerán más cerca del lanzamiento.",
    ],
    category: "gameplay",
    author: "diego-ramirez",
    publishedAt: "2025-11-03T16:45:00Z",
    cover:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=675&fit=crop",
    coverAlt:
      "Pantalla de videojuego con mundo abierto urbano nocturno con luces de neón",
    tags: ["Mecánicas", "IA", "Interiores", "Personalización", "Combate"],
    readingTime: 9,
  },
  {
    slug: "gta-vi-pc-cuando-llegara-version-pc",
    title:
      "¿Cuándo llegará GTA VI a PC? Todo lo que sabemos sobre la versión de ordenador",
    excerpt:
      "Rockstar ha confirmado que la versión de PC de GTA VI llegará después que la de consolas. Analizamos el patrón histórico de la compañía y las posibles fechas.",
    content: [
      "Una de las preguntas más repetidas entre la comunidad de PC es cuándo podrá disfrutar de Grand Theft Auto VI en sus ordenadores. Rockstar ha confirmado oficialmente que la versión de PC llegará con posterioridad a la de PlayStation 5 y Xbox Series X|S, que se lanzarán el 26 de mayo de 2026. Esta estrategia de retrasar la versión de PC es habitual en la compañía y responde a varios factores.",
      "El principal motivo es técnico. Mientras que las consolas tienen un hardware homogéneo que permite optimizar el juego de forma precisa, el ecosistema PC es enormemente diverso, con miles de combinaciones de procesadores, tarjetas gráficas, memorias y configuraciones. Rockstar prefiere lanzar primero en consolas para garantizar una experiencia pulida, y posteriormente dedicar recursos a adaptar el juego a la variedad del PC.",
      "El patrón histórico respalda esta interpretación. GTA V salió en PS3 y Xbox 360 en septiembre de 2013, y no llegó a PC hasta abril de 2015, casi 19 meses después. Red Dead Redemption 2 se lanzó en consolas en octubre de 2018 y aterrizó en PC en noviembre de 2019, justo un año y un mes más tarde. Si aplicamos la misma lógica a GTA VI, la versión de PC podría llegar entre finales de 2026 y mediados de 2027.",
      "Otro factor a considerar es el ciclo de revisiones y ports. Rockstar tiene la costumbre de lanzar primero las versiones de la generación actual de consolas, posteriormente las versiones mejoradas para consolas del próximo ciclo si lo hubiere, y finalmente la versión de PC con todas las mejoras gráficas acumuladas. Esto sugiere que la versión de PC podría ser la más completa técnicamente, con soporte para tecnologías avanzadas como ray tracing completo, DLSS o FSR.",
      "Desde la comunidad de PC hay cierta frustración con esta estrategia, especialmente entre los jugadores que han invertido en hardware de gama alta para disfrutar de los últimos lanzamientos. Sin embargo, también hay quienes prefieren esperar a la versión de PC por sus ventajas evidentes: mayor resolución, framerate desbloqueado, soporte para mods, configuración de controles personalizable y posibilidad de jugar en monitores de alta densidad.",
      "Rockstar aún no ha dado detalles sobre los requisitos técnicos de la versión de PC, pero todo apunta a que serán exigentes. Considerando el salto visual que representan los tráileres y la complejidad del mundo abierto, es probable que se necesite una tarjeta gráfica de gama alta de la generación RTX 40 o equivalente para jugar en configuraciones máximas a 4K y 60 fps.",
      "Mientras tanto, los jugadores de PC tendrán que conformarse con seguir jugando GTA V, que sigue recibiendo actualizaciones de GTA Online, o explorar alternativas del género como Cyberpunk 2077 o el próximo Saints Row. La espera, aunque larga, promete valer la pena si Rockstar mantiene el nivel de calidad que le caracteriza y aprovecha al máximo el hardware moderno.",
    ],
    category: "noticias",
    author: "diego-ramirez",
    publishedAt: "2025-11-01T10:00:00Z",
    cover:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&h=675&fit=crop",
    coverAlt: "Setup gaming de PC con luces RGB y monitores mostrando videojuegos",
    tags: ["PC", "Lanzamiento", "Rockstar", "Requisitos", "Mods"],
    readingTime: 6,
  },
  {
    slug: "gta-vi-online-modo-multijugador-novedades",
    title:
      "GTA Online en GTA VI: cómo será el modo multijugador y qué novedades traerá",
    excerpt:
      "Rockstar prepara una evolución masiva de GTA Online para GTA VI. Repasamos las novedades esperadas: mundo compartido, contenido continuo y modelo económico.",
    content: [
      "GTA Online ha sido uno de los mayores éxitos comerciales de la historia de los videojuegos, generando miles de millones de dólares en ingresos recurrentes para Take-Two Interactive durante más de una década. Con GTA VI, Rockstar prepara una evolución masiva del modo multijugador que promete corregir los errores del pasado y aprovechar las lecciones aprendidas en años de operación.",
      "La principal novedad esperada es la transición hacia un mundo verdaderamente compartido. Mientras que en GTA Online los jugadores se reunían en instancias limitadas, todo apunta a que en GTA VI Online habrá servidores más poblados, eventos dinámicos a escala global y una sensación de mundo vivo más convincente. Esto acercaría el modo a experiencias como la de los MMORPG, sin perder la esencia de GTA.",
      "El modelo económico, una de las críticas más recurrentes a GTA Online, también será revisado. La inflación de precios y la dependencia de las tarjetas Shark generaron frustración entre los jugadores, especialmente entre los recién llegados que se encontraban con un mercado dominado por veteranos con cuentas consolidadas. Rockstar parece consciente del problema y trabajará en un sistema más equilibrado, accesible y con progresión más justa.",
      "Otra mejora esperada es la integración entre el modo historia y el modo online. Mientras que en GTA V ambos modos estaban claramente separados, en GTA VI podría haber una conexión más fluida, con personajes, eventos y elementos que se compartan o se influencien mutuamente. Esto crearía una experiencia más coherente y permitiría a los jugadores disfrutar de ambas facetas sin sensación de desconexión.",
      "El contenido continuo será, como en GTA Online, la base del modelo a largo plazo. Rockstar ha demostrado una capacidad excepcional para mantener el interés de la comunidad durante años con actualizaciones regulares que añaden misiones, vehículos, propiedades, modos de juego y eventos estacionales. Se espera que GTA VI Online reciba incluso más apoyo, con ciclos de actualización más ambiciosos y contenido de mayor escala.",
      "La creación de contenido por parte de la comunidad también tendrá un papel destacado. Aunque Rockstar ha sido tradicionalmente cauto con los mods en sus modos online, podría abrir la puerta a un sistema controlado de contenido generado por usuarios, similar al de otros juegos exitosos. Esto ampliaría enormemente la longevidad y la variedad de experiencias disponibles.",
      "Por último, es importante destacar que GTA VI Online será gratuito para quienes posean el juego base, manteniendo el modelo de GTA Online. La monetización se basará en contenido cosmético, vehículos, propiedades y aceleradores de progresión, evitando el polémico modelo pay-to-win. Los detalles concretos se conocerán más cerca del lanzamiento del modo online, que podría activarse semanas o meses después del debut del juego base.",
    ],
    category: "gameplay",
    author: "sofia-torres",
    publishedAt: "2025-10-29T13:20:00Z",
    cover:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=675&fit=crop",
    coverAlt: "Vista aérea de una ciudad de noche con multitud de luces y tráfico",
    tags: ["GTA Online", "Multijugador", "Mundo compartido", "Contenido", "Monetización"],
    readingTime: 8,
  },
  {
    slug: "rumores-filtracion-septiembre-2023-analisis",
    title:
      "La gran filtración de GTA VI en septiembre de 2023: qué se filtró y qué cambió",
    excerpt:
      "Hace dos años, una filtración masiva sacudió a Rockstar y reveló decenas de vídeos de GTA VI en desarrollo. Recordamos qué se vio y cómo afectó al proyecto.",
    content: [
      "En septiembre de 2023, Rockstar Games sufrió una de las filtraciones más grandes de la historia de los videojuegos. Un atacante accedió a material interno del estudio y publicó en línea más de 90 vídeos y capturas de pantalla que mostraban Grand Theft Auto VI en estado de desarrollo. El suceso conmocionó a la industria y generó un debate sobre seguridad, privacidad y la ética de consumir material filtrado.",
      "El material mostraba escenas de gameplay muy preliminar, con texturas sin terminar, animaciones en bloque y placeholders visuales. Aun así, permitió confirmar muchos de los rumores que circulaban por la comunidad: el regreso a Vice City, la pareja de protagonistas formada por Lucia y Jason, y la presencia de mecánicas como la navegación, los interiores accesibles y un sistema de IA más avanzado para los NPCs.",
      "Rockstar reaccionó con un comunicado oficial reconociendo la filtración y expresando su decepción por la difusión de material que no representaba la calidad final del producto. La compañía pidió a la comunidad que respetara el trabajo del equipo y esperara a los comunicados oficiales. Poco después, en diciembre de 2023, publicó el primer tráiler oficial del juego, adelantando su publicación para adelantarse a nuevas filtraciones.",
      "La filtración tuvo varias consecuencias para el proyecto. Internamente, Rockstar reforzó sus protocolos de seguridad y restringió el acceso al material interno, lo que ralentizó algunas dinámicas de trabajo. También generó presión sobre el equipo de marketing, que tuvo que redefinir su estrategia de comunicación para adaptarse a una comunidad que ya había visto material no oficial.",
      "Para los fans, la filtración fue un fenómeno de doble filo. Por un lado, permitió satisfacer la curiosidad de una comunidad sedienta de información tras años de silencio. Por otro, generó expectativas que no se ajustaban al estado real del proyecto, ya que muchos confundieron las imágenes preliminares con la calidad final del juego. Rockstar tuvo que trabajar duro para reconducir las expectativas con comunicaciones posteriores.",
      "A nivel legal, el autor de la filtración fue identificado y procesado. Se trataba de un joven británico que formaba parte de un grupo de hackers especializado en atacar empresas tecnológicas. El caso sentó un precedente importante sobre las consecuencias legales de este tipo de ataques, especialmente cuando afectan a propiedades intelectuales de alto valor como GTA VI.",
      "Hoy, dos años después, la filtración se recuerda como un episodio desafortunado pero también como un punto de inflexión en la comunicación de Rockstar con su comunidad. La compañía, tradicionalmente hermética, ha adoptado una estrategia ligeramente más abierta con comunicados periódicos, tráileres controlados y colaboraciones con medios especializados para mantener el interés sin depender de filtraciones.",
    ],
    category: "rumores",
    author: "sofia-torres",
    publishedAt: "2025-10-26T08:30:00Z",
    cover:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop",
    coverAlt: "Pantalla de ordenador con código y datos, simbolizando una filtración digital",
    tags: ["Filtración", "2023", "Seguridad", "Rockstar", "Comunidad"],
    readingTime: 7,
  },
  {
    slug: "banda-sonora-gta-vi-music-licencias",
    title:
      "Banda sonora de GTA VI: qué artistas y estilos musicales esperamos en Vice City",
    excerpt:
      "La música ha sido siempre un pilar de la saga GTA. Analizamos qué artistas, géneros y emisoras podríamos escuchar en GTA VI, entre nostalgias de los 80 y sonidos actuales.",
    content: [
      "La música ha sido siempre uno de los pilares identitarios de la saga Grand Theft Auto. Desde las icónicas emisoras de GTA: Vice City con su inolvidable selección de temas de los 80, hasta la cuidada banda sonora de GTA V con estilos para todos los gustos, Rockstar ha demostrado un dominio absoluto del uso de la música como elemento narrativo y ambiental. En GTA VI, las expectativas están por las nubes.",
      "El regreso a Vice City hace inevitable la nostalgia de los 80. Aunque el juego está ambientado en la actualidad, se espera que varias emisoras rindan homenaje a la era dorada del synthwave, el pop y el rock que definieron la ciudad en su entrega original. Artistas como Michael Jackson, Phil Collins, Bryan Adams o A Flock of Seagulls podrían regresar, aunque las negociaciones de licencias son siempre complejas.",
      "Junto con la nostalgia, GTA VI reflejará la realidad musical actual de Miami, una de las ciudades más vibrantes del mundo en términos de industria musical. El reguetón, el trap latino, la música electrónica de club y el pop urbano tendrán protagonismo asegurado, con artistas como Bad Bunny, Karol G, Rosalía, Drake o The Weeknd como candidatos naturales para encabezar las listas de las emisoras contemporáneas.",
      "La música latina será uno de los grandes protagonistas, en consonancia con la demografía de Miami y con la presencia de Lucia como protagonista. Se espera una o varias emisoras dedicadas a géneros como la salsa, el merengue, el bolero y la bachata, junto con programas de radio hablados en español que aporten autenticidad al ambiente de Little Havana y otros barrios de influencia cubana y caribeña.",
      "Otro aspecto a destacar será la música electrónica, especialmente el house y el techno que son parte inseparable de la cultura de club de Miami. Las emisoras dedicadas a estos géneros podrían contar con DJs y productores reales como locutores invitados, una fórmula que Rockstar ya empleó con éxito en GTA Online con los DJ Sets de Los Santos Underground Radio.",
      "La negociación de licencias es uno de los mayores retos a los que se enfrenta Rockstar. Conseguir los derechos de cientos de canciones para un juego que estará en el mercado durante años es un proceso complejo y costoso. Además, las plataformas de streaming han cambiado las reglas del juego, y muchos artistas son ahora más reacios a ceder sus temas por periodos prolongados. Rockstar tendrá que equilibrar su presupuesto musical entre clásicos atemporales y novedades de moda.",
      "Por último, no podemos olvidar la posibilidad de que GTA VI Online cuente con conciertos virtuales, una tendencia que se ha consolidado en el mundo de los videojuegos tras experiencias como las de Fortnite o Roblox. Rockstar podría replicar el éxito de los clubes nocturnos de GTA Online con eventos en directo, sesiones DJ exclusivas y presentaciones de artistas reales dentro del juego, elevando aún más el componente musical del título.",
    ],
    category: "noticias",
    author: "laura-vega",
    publishedAt: "2025-10-23T17:00:00Z",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=675&fit=crop",
    coverAlt: "Silueta de DJ en una fiesta nocturna con luces de colores y humo",
    tags: ["Música", "Banda sonora", "Vice City", "Licencias", "Emisoras"],
    readingTime: 8,
  },
  {
    slug: "take-two-previsiones-financieras-gta-vi",
    title:
      "Take-Two eleva sus previsiones financieras por GTA VI: esperan batir todos los récords",
    excerpt:
      "La matriz de Rockstar ha revisado al alza sus ingresos previstos para el ejercicio fiscal 2026 gracias al lanzamiento de GTA VI. Los analistas prevén cifras récord.",
    content: [
      "Take-Two Interactive, empresa matriz de Rockstar Games, ha revisado al alza sus previsiones financieras para el ejercicio fiscal 2026 tras la confirmación de la fecha de lanzamiento de Grand Theft Auto VI. La compañía espera alcanzar ingresos netos superiores a los 5.500 millones de dólares en ese periodo, lo que representaría un crecimiento interanual de más del 30% impulsado principalmente por el lanzamiento del título.",
      "Las previsiones, comunicadas en la última llamada a inversores, reflejan la enorme confianza de Take-Two en el rendimiento comercial de GTA VI. Strauss Zelnick, CEO de la compañía, describió el título como el lanzamiento más ambicioso de la historia de la empresa y uno de los acontecimientos más importantes de la industria del entretenimiento en la última década.",
      "Los analistas financieros son aún más optimistas. Firmas como Wedbush Securities o Jefferies proyectan que GTA VI podría superar los 3.200 millones de dólares en ingresos solo en su primer año, lo que convertiría al título en el lanzamiento de entretenimiento más rentable de la historia, por delante incluso de blockbusters cinematográficos como Avengers: Endgame o Avatar. Estas estimaciones incluyen ventas del juego base, microtransacciones del modo online y contenido descargable.",
      "El motor principal de estos ingresos será, como en GTA V, el modo online. GTA Online ha generado más de 1.000 millones de dólares anuales para Take-Two durante varios ejercicios consecutivos, gracias a su modelo de contenido recurrente y microtransacciones. Si GTA VI Online logra mantener o superar estos registros, podría convertirse en una fuente de ingresos masivos durante al menos una década, algo sin precedentes en la industria del videojuego.",
      "Otro factor a considerar es el impacto en las ventas de hardware. Históricamente, los lanzamientos de la saga GTA han impulsado de forma significativa las ventas de consolas, especialmente entre jugadores casuales que actualizan su equipo para disfrutar del nuevo título. Tanto Sony como Microsoft podrían ver incrementadas sus ventas de PS5 y Xbox Series X|S durante los meses posteriores al lanzamiento de GTA VI, con el correspondiente beneficio para todo el ecosistema.",
      "En el ámbito bursátil, las acciones de Take-Two han experimentado una subida sostenida en las semanas posteriores al anuncio de la fecha de lanzamiento. Los inversores parecen haber asimilado positivamente la confirmación del calendario y las previsiones financieras, aunque algunos analistas advierten que gran parte de las expectativas ya estaban descontadas en el precio. La volatilidad será elevada durante los meses previos y posteriores al lanzamiento.",
      "Por último, el éxito de GTA VI tendrá un impacto significativo en la industria del videojuego en su conjunto. Otros estudios podrían ajustar sus calendarios para evitar competir directamente con el título, y muchas compañías están preparando estrategias para contrarrestar el efecto distractor que tendrá sobre el consumo de otros juegos durante los meses posteriores a su lanzamiento. Lo que está claro es que el lanzamiento de GTA VI será un acontecimiento que marcará un antes y un después en la industria.",
    ],
    category: "noticias",
    author: "carlos-mendoza",
    publishedAt: "2025-10-20T12:00:00Z",
    cover:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a4?w=1200&h=675&fit=crop",
    coverAlt:
      "Gráficos financieros al alza con cifras en pantalla, representando crecimiento de Take-Two",
    tags: ["Take-Two", "Finanzas", "Ingresos", "Análisis", "Bolsa"],
    readingTime: 7,
  },
  {
    slug: "gta-vi-requisitos-tecnicos-ps5-xbox",
    title:
      "Requisitos técnicos de GTA VI: resolución, framerate y características en PS5 y Xbox Series",
    excerpt:
      "Analizamos qué podemos esperar técnicamente de GTA VI en la actual generación de consolas: resolución, framerate, ray tracing y aprovechamiento del hardware.",
    content: [
      "Con el lanzamiento de Grand Theft Auto VI cada vez más cercano, una de las grandes preguntas de la comunidad técnica es qué rendimiento ofrecerá el juego en las consolas de nueva generación. PlayStation 5 y Xbox Series X|S, lanzadas en 2020, son el hardware elegido por Rockstar para estrenar el título, y todo apunta a que el estudio extraerá hasta el último recurso disponible en estas máquinas.",
      "En cuanto a resolución, lo más probable es que GTA VI se mueva en un rango dinámico entre 1440p y 4K en PlayStation 5 y Xbox Series X, utilizando técnicas de reconstrucción de imagen como FSR o una solución propietaria de Rockstar. Xbox Series S, con hardware más modesto, podría moverse en torno a 1080p, manteniendo la fluidez pero sacrificando algo de nitidez respecto a sus hermanas mayores.",
      "El framerate es uno de los aspectos más debatidos. Mientras los jugadores más competitivos demandan 60 fps, las exigencias técnicas de un mundo abierto tan denso como el de GTA VI hacen difícil garantizar esa fluidez sin sacrificar calidad visual. Lo más probable es que Rockstar ofrezca un modo calidad a 30 fps con todas las mejoras gráficas activadas, y un modo rendimiento a 60 fps con reducción de resolución y desactivación de algunas funciones avanzadas.",
      "El ray tracing, una de las tecnologías estrella de la actual generación, estará presente de forma parcial. Según las filtraciones y los análisis de los tráileres, se utilizará principalmente para reflejos en tiempo real, iluminación global en escenas clave y sombras suaves. Sin embargo, es improbable que se aplique de forma global debido al coste de rendimiento, especialmente en consolas donde el ancho de banda de memoria es un factor limitante.",
      "El SSD de nueva generación jugará un papel crucial en la experiencia de GTA VI. Gracias a su velocidad de lectura, el juego podrá cargar el mundo abierto sin pantallas de transición, permitiendo moverse entre interiores y exteriores de forma fluida. También se reducirá drásticamente el tiempo de carga inicial y los tiempos de reaparición tras morir o reiniciar una misión, una mejora muy demandada por la comunidad.",
      "El motor RAGE, propiedad de Rockstar, ha sido profundamente actualizado para esta entrega. Las versiones anteriores ya impresionaban en títulos como Red Dead Redemption 2, pero GTA VI parece dar un salto cualitativo en iluminación, físicas, IA y gestión de NPCs. La compañía ha invertido años de desarrollo en modernizar el motor y aprovechar al máximo el hardware de la nueva generación.",
      "En el apartado de audio, GTA VI también promete elevar el listón. Se espera soporte para audio 3D Tempest 3D Audio en PS5 y Windows Sonic en Xbox, lo que permitirá una inmersión sonora sin precedentes. La tecnología de audio espacial combinada con la densidad del mundo abierto creará una experiencia auditiva única, especialmente con el uso de auriculares, donde se podrán localizar con precisión las fuentes de sonido en el entorno.",
    ],
    category: "gameplay",
    author: "diego-ramirez",
    publishedAt: "2025-10-17T15:45:00Z",
    cover:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=675&fit=crop",
    coverAlt: "Consolas PlayStation 5 y Xbox Series X mostradas juntas sobre fondo oscuro",
    tags: ["PS5", "Xbox Series", "Rendimiento", "Ray tracing", "SSD"],
    readingTime: 8,
  },
  {
    slug: "gta-vi-ediciones-coleccionista-reservas",
    title:
      "Ediciones y reservas de GTA VI: qué versiones habrá y cuándo se abren las reservas",
    excerpt:
      "Rockstar prepara varias ediciones de GTA VI, desde la estándar hasta una edición de coleccionista. Repasamos qué se sabe sobre reservas, precios y contenido extra.",
    content: [
      "Aunque la fecha de lanzamiento de Grand Theft Auto VI está confirmada para el 26 de mayo de 2026, Rockstar aún no ha abierto oficialmente las reservas del juego. Sin embargo, las filtraciones de minoristas y los patrones históricos de la compañía permiten anticipar qué ediciones estarán disponibles y cuándo se podrán reservar.",
      "Siguiendo el modelo de GTA V y Red Dead Redemption 2, lo más probable es que Rockstar ofrezca tres ediciones principales: la edición estándar, una edición deluxe con contenido digital adicional, y una edición de coleccionista con extras físicos y digitales. Esta última, como es habitual en la compañía, tendrá una producción limitada y se convertirá en objeto de deseo para los fans más acérrimos.",
      "La edición estándar incluirá el juego base y, durante el periodo de reserva, algún contenido digital adicional como dinero dentro del juego o un vehículo exclusivo para GTA VI Online. Su precio se mantendrá probablemente en los 69,99 dólares o euros, la tarifa estándar para los lanzamientos AAA de nueva generación.",
      "La edición deluxe, con un precio estimado de 89,99 a 99,99 dólares, añadirá más contenido digital: paquetes de personalización para los protagonistas, vehículos adicionales, propiedades dentro del juego y posiblemente acceso anticipado a determinados modos o eventos. Suele ser la opción preferida de los jugadores que planean invertir muchas horas en el modo online.",
      "La edición de coleccionista, con un precio que podría superar los 199,99 dólares, incluirá elementos físicos como una caja especial, un libro de arte, la banda sonora en formato físico, un mapa impreso del estado de Leonida y posiblemente una figura o estatua de los protagonistas. A esto se sumará todo el contenido digital de las ediciones anteriores, más algunos extras exclusivos para los coleccionistas.",
      "En cuanto a las fechas de reserva, Rockstar tiene la costumbre de abrir las pre-ordas entre 6 y 8 meses antes del lanzamiento. Si se mantiene este patrón, las reservas de GTA VI podrían abrirse entre octubre y diciembre de 2025. Los minoristas especializados ya están preparando sus sistemas para gestionar lo que se prevé como una de las campañas de reserva más masivas de la historia del videojuego.",
      "Conviene recordar, sin embargo, que todas estas informaciones son especulativas hasta que Rockstar haga el anuncio oficial. La compañía es conocida por mantener un control estricto sobre la información y por sorprender a la comunidad con decisiones que no siempre se ajustan a lo esperado. Lo único seguro es que, cuando se abran las reservas, la demanda será tan alta que muchos minoristas tendrán dificultades para gestionarla.",
    ],
    category: "fecha-lanzamiento",
    author: "carlos-mendoza",
    publishedAt: "2025-10-14T10:30:00Z",
    cover:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=1200&h=675&fit=crop",
    coverAlt: "Caja de videojuego de edición coleccionista con extras físicos sobre una mesa",
    tags: ["Ediciones", "Reservas", "Precio", "Coleccionista", "Contenido extra"],
    readingTime: 6,
  },
  {
    slug: "rockstar-games-historia-estudio-gta-vi",
    title:
      "Rockstar Games: la historia del estudio detrás de GTA VI y su revolución cultural",
    excerpt:
      "Repasamos la trayectoria de Rockstar Games, desde sus orígenes en Dundee hasta convertirse en uno de los estudios más influyentes de la industria del videojuego.",
    content: [
      "Rockstar Games es, sin lugar a dudas, uno de los estudios más influyentes de la historia del videojuego. Fundada en 1998 como división de Take-Two Interactive, la compañía ha sido responsable de algunas de las franquicias más exitosas y culturalmente relevantes de las últimas décadas, con Grand Theft Auto como buque insignia y revolución cultural en sí misma.",
      "Los orígenes de Rockstar se remontan a DMA Design, un estudio escocés fundado en 1987 en Dundee. DMA fue el creador del primer Grand Theft Auto en 1997, un título con visión cenital que, pese a sus gráficos simples, ya contenía las semillas de lo que sería la saga: mundo abierto, libertad de acción, misiones criminales y una narrativa irreverente. Take-Two adquirió DMA en 1999 y la rebautizó como Rockstar North, embrión del imperio Rockstar.",
      "El verdadero salto cualitativo llegó con Grand Theft Auto III en 2001. El paso a las 3D transformó por completo la experiencia, ofreciendo por primera vez un mundo abierto completamente tridimensional con una libertad sin precedentes. El impacto cultural fue inmenso, y el título marcó un antes y un después en la industria. A partir de ahí, Rockstar consolidó su identidad con secuelas que exploraban distintas ciudades y épocas: Vice City, San Andreas, GTA IV y finalmente GTA V.",
      "Junto a GTA, Rockstar ha desarrollado otras franquicias memorables. Red Dead Redemption llevó el mundo abierto al oeste americano con una narrativa madura y emotiva. Bully exploró la vida en un instituto con ironía y sensibilidad. Max Payne 3 reinventó el thriller noir. L.A. Noire, aunque desarrollado por Team Bondi, fue publicado por Rockstar y experimentó con mecánicas de interrogatorio e investigación. Cada título demostraba la versatilidad del estudio y su compromiso con la calidad.",
      "La cultura interna de Rockstar es uno de los aspectos más comentados de la compañía. Conocida por su hermetismo y por la exigencia hacia sus empleados, ha sido objeto de controversia en varias ocasiones, especialmente durante el desarrollo de Red Dead Redemption 2, cuando se denunciaron condiciones de trabajo abusivas con jornadas extensas y crunch prolongado. La compañía ha asegurado haber mejorado sus prácticas laborales en los últimos años, aunque el ritmo de trabajo en un proyecto de la magnitud de GTA VI sigue siendo intensivo.",
      "La figura de los hermanos Dan y Sam Houser ha sido central en la identidad de Rockstar. Dan, guionista principal y vicepresidente creativo, dejó la compañía en 2020 tras completar Red Dead Redemption 2, lo que supuso un cambio generacional en la dirección creativa. Sam Houser sigue al frente como presidente, manteniendo el control creativo de los proyectos y el rumbo estratégico del estudio.",
      "Con GTA VI, Rockstar afronta el lanzamiento más importante de su historia. Las expectativas son enormes, tanto desde el punto de vista creativo como comercial, y el éxito o fracaso del título marcará la trayectoria del estudio en la próxima década. Si la compañía mantiene su nivel habitual de calidad y logra sorprender a la comunidad como ha hecho en el pasado, estaremos ante un nuevo hito en la historia del videojuego.",
    ],
    category: "noticias",
    author: "laura-vega",
    publishedAt: "2025-10-10T09:00:00Z",
    cover:
      "https://images.unsplash.com/photo-1556438096-ec2b6c5c1d94?w=1200&h=675&fit=crop",
    coverAlt:
      "Edificio de oficinas modernas con logo corporativo, representando la sede de un estudio de videojuegos",
    tags: ["Rockstar Games", "Historia", "DMA Design", "Take-Two", "Cultura"],
    readingTime: 9,
  },
  {
    slug: "gta-vi-competencia-mundos-abiertos-2026",
    title:
      "GTA VI y su competencia: qué otros mundos abiertos llegarán en 2026",
    excerpt:
      "GTA VI no será el único gran mundo abierto de 2026. Analizamos qué competidores tendrá y cómo afectará esto al panorama de la industria del videojuego.",
    content: [
      "El año 2026 se perfila como uno de los más competitivos de la historia reciente en el género de mundos abiertos. Junto al esperado lanzamiento de Grand Theft Auto VI, varios títulos de gran presupuesto están programados para llegar en el mismo periodo, lo que promete un año apasionante para los aficionados al género y una competencia feroz entre los grandes estudios.",
      "Una de las claves de la competencia será el calendario. Es probable que muchos estudios ajusten sus fechas de lanzamiento para evitar coincidir directamente con GTA VI, conscientes del efecto distractor que tendrá sobre el consumo de otros juegos. Sin embargo, algunos títulos lo suficientemente diferenciados en género o temática podrían mantenerse en su fecha original, buscando aprovechar la atención generalizada que tendrá el sector durante esos meses.",
      "Entre los competidores más directos en el ámbito de mundos abiertos urbanos se encuentran proyectos como el nuevo Saints Row, que intentará relanzarse tras el fracaso del reboot de 2022. Aunque su escala y presupuesto son muy inferiores a los de GTA VI, su tono irreverente y su propuesta de pandillas urbanas lo sitúan en una categoría similar. Watch Dogs, de Ubisoft, es otra franquicia que podría regresar en este periodo, aunque la compañía francesa no ha confirmado oficialmente un nuevo título.",
      "Fuera del ámbito urbano, otros mundos abiertos de gran escala competirán por la atención de los jugadores. Bethesda está trabajando en The Elder Scrolls VI, aunque su fecha de lanzamiento aún es incierta y podría retrasarse más allá de 2026. CD Projekt Red, por su parte, desarrolla la nueva entrega de The Witcher, pero su lanzamiento tampoco parece inminente. Ambos títulos, cuando lleguen, ofrecerán una alternativa de mundo abierto fantástico frente al realismo urbano de GTA VI.",
      "En el ámbito de los mundos abiertos de acción, varios proyectos asiáticos podrían ganar relevancia en 2026. Estudios chinos, coreanos y japoneses están invirtiendo fuertemente en juegos de este tipo, con producciones de calidad técnica creciente. Títulos como Black Myth: Wukong han demostrado que la industria asiática puede competir de tú a tú con las producciones occidentales, y se espera que esta tendencia se consolide en los próximos años.",
      "Una mención especial merecen los mundos abiertos basados en propiedades intelectuales cinematográficas o de streaming. La creciente convergencia entre videojuegos y otras formas de entretenimiento está llevando a la creación de experiencias abiertas basadas en franquicias populares, una tendencia que podría intensificarse en 2026. Aunque estos títulos suelen tener menor presupuesto que GTA VI, su conexión con propiedades reconocidas les garantiza una base de audiencia significativa.",
      "Para Rockstar, la competencia es un acicate más que una amenaza. La saga GTA ha demostrado históricamente su capacidad para dominar el mercado incluso en periodos de gran actividad, y GTA VI tiene todos los números para convertirse en el lanzamiento más exitoso del año, independientemente de lo que ofrezcan otros estudios. Lo que sí es seguro es que 2026 será un año histórico para los aficionados a los mundos abiertos, con una oferta sin precedentes en términos de calidad y variedad.",
    ],
    category: "noticias",
    author: "carlos-mendoza",
    publishedAt: "2025-10-07T14:15:00Z",
    cover:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=675&fit=crop",
    coverAlt: "Varios mandos de videojuegos sobre una mesa, simbolizando la competencia entre títulos",
    tags: ["Competencia", "2026", "Mundos abiertos", "Industria", "Análisis"],
    readingTime: 7,
  },
];

// Utilidades de acceso a datos
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category === categorySlug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => a.trending);
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getRelatedArticles(
  slug: string,
  category: string,
  limit = 3
): Article[] {
  return articles
    .filter((a) => a.slug !== slug && a.category === category)
    .slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getArticleUrl(slug: string): string {
  return `/articulo/${slug}`;
}

export function getCategoryUrl(slug: string): string {
  return `/categoria/${slug}`;
}
