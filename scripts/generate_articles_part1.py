#!/usr/bin/env python3
"""
Genera el bloque de código TypeScript con 27 artículos de GTA VI
para el periodo 15 ago - 15 sep 2026 (uno por día, omitiendo los días
que ya tienen artículo existente).

Output: /tmp/new_articles.txt - texto listo para insertar en data.ts
antes del cierre del array `articles`.
"""

import json

# Plantilla de artículo
TEMPLATE = '''  {{
    slug: "{slug}",
    title: {title},
    excerpt: {excerpt},
    content: {content},
    category: "{category}",
    author: "{author}",
    publishedAt: "{publishedAt}",
    cover: placeholderImage("{cover_cat}", "{cover_label}"),
    coverAlt: {cover_alt},
    tags: {tags},
    readingTime: {reading_time},
    sources: {sources},
  }},
'''

# Helper para TS string con comillas dobles escapadas
def ts(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

def ts_array(items: list[str]) -> str:
    return "[" + ", ".join(ts(i) for i in items) + "]"

def ts_sources(sources: list[tuple[str, str]]) -> str:
    return "[" + ", ".join(
        '{ "name": ' + ts(n) + ', "url": ' + ts(u) + " }" for n, u in sources
    ) + "]"

# 27 artículos del 16 ago al 15 sep 2026 (excluyendo 15 ago, 20 ago, 28 ago, 10 sep que ya existen)
ARTICLES = [
    # 16 ago
    {
        "slug": "rockstar-confirma-extended-look-netflix-agosto",
        "title": "Rockstar anuncia 'GTA VI: An Extended Look' para el 27 de agosto en Netflix",
        "excerpt": "Rockstar Games ha confirmado que el 27 de agosto estrenará en Netflix un avance extendido de GTA VI, capturado íntegramente en PS5, antes de publicarlo en YouTube.",
        "category": "trailers",
        "author": "carlos-mendoza",
        "date": "2026-08-16T15:30:00Z",
        "cover_cat": "trailers",
        "cover_label": "Extended Look",
        "cover_alt": "Imagen conceptual del avance extendido de GTA VI en Netflix",
        "tags": ["Extended Look", "Netflix", "Tráiler", "Rockstar", "PS5"],
        "reading_time": 5,
        "sources": [
            ("Rockstar Games - Anuncio oficial", "https://www.rockstargames.com/newswire"),
            ("Game Informer - Anuncio Extended Look", "https://www.gameinformer.com"),
            ("Vice - Trailer en Netflix", "https://www.vice.com"),
        ],
        "content": [
            "Rockstar Games ha anunciado que el próximo 27 de agosto estrenará «Grand Theft Auto VI: An Extended Look», un avance extendido del juego que se emitirá exclusivamente en Netflix a las 3 de la tarde (hora del Este) antes de publicarse en el canal de YouTube de Rockstar seis horas después. La noticia, desvelada el 6 de agosto, supone la primera gran movida de marketing de Rockstar de cara al lanzamiento del 19 de noviembre de 2026.",
            "Lo más relevante del anuncio es que el avance está capturado íntegramente en PlayStation 5, lo que confirma que Rockstar está utilizando la consola de Sony como plataforma principal para mostrar el juego al público. Esta decisión no es casual: PS5 es la plataforma líder de la actual generación y Rockstar tiene históricamente una relación estrecha con Sony. La versión de PS5 Pro también recibirá mejoras específicas, según filtraciones anteriores de minoristas.",
            "La elección de Netflix como plataforma de estreno es toda una novedad para la saga. Tradicionalmente, Rockstar ha publicado sus tráileres directamente en YouTube y en su web oficial. El salto a una plataforma de streaming de vídeo sugiere que Take-Two está explorando nuevas formas de llegar a audiencias más allá de la comunidad gamer tradicional, aprovechando el alcance masivo de Netflix que supera los 250 millones de suscriptores en todo el mundo.",
            "El término «Extended Look» sugiere que no se trata de un tráiler cinematográfico convencional, sino de algo más extenso y posiblemente con secuencias de gameplay real. Esto encaja con lo que los fans llevan pidiendo desde el segundo tráiler de mayo de 2025: ver el juego en movimiento, no solo escenas cuidadosamente seleccionadas. Si Rockstar muestra secuencias de juego largas, podría ser la primera vez que veamos la nueva IA de NPCs, los interiores accesibles y las mecánicas de navegación en acción.",
            "Desde Take-Two, su CEO Strauss Zelnick ya había confirmado en mayo que la campaña de marketing de GTA VI sería «significativa y diferente» a la de GTA V. La colaboración con Netflix encaja perfectamente con esa promesa. Es de esperar que en las semanas previas al 27 de agosto veamos más movidas de marketing, posiblemente colaboraciones con marcas, eventos presenciales y publicaciones graduales de screenshots en la web oficial, como ya ha venido haciendo Rockstar en las últimas semanas.",
            "La comunidad ha recibido el anuncio con enorme expectación. Tras más de un año desde el segundo tráiler, los fans están sedientos de contenido nuevo y muchos esperan que este «Extended Look» responda a algunas de las preguntas que quedaron abiertas: cómo se ve el juego en movimiento, cómo funciona la dinámica entre Lucia y Jason en misiones, y qué aspecto tienen los interiores accesibles. El 27 de agosto se ha convertido de facto en una nueva fecha clave para la saga.",
        ],
    },
    # 17 ago
    {
        "slug": "gta-vi-screenshots-vintage-vice-city-pack",
        "title": "Rockstar publica nuevas capturas del Vintage Vice City Pack, la bonificación de reserva",
        "excerpt": "La web oficial de GTA VI se actualiza con nuevas screenshots que muestran el Vintage Vice City Pack, la colección de objetos retro que recibirán quienes reserven el juego antes del 20 de noviembre.",
        "category": "noticias",
        "author": "sofia-torres",
        "date": "2026-08-17T11:00:00Z",
        "cover_cat": "noticias",
        "cover_label": "Vintage Vice City Pack",
        "cover_alt": "Imagen conceptual del Vintage Vice City Pack de GTA VI",
        "tags": ["Vintage Vice City Pack", "Screenshots", "Reservas", "Bonificación", "Ultimate Edition"],
        "reading_time": 5,
        "sources": [
            ("Rockstar Games - Galería oficial", "https://www.rockstargames.com/gta-vi"),
            ("Resetera - Nuevas screenshots", "https://www.resetera.com"),
        ],
        "content": [
            "La web oficial de Grand Theft Auto VI se ha actualizado silenciosamente en las últimas horas con nuevas capturas de pantalla que muestran en detalle el Vintage Vice City Pack, la colección de objetos digitales que recibirán quienes reserven el juego antes del 20 de noviembre. Las imágenes, que muestran vehículos, ropas y personalización con estética retro inspirada en la Vice City original de 2002, han reavivado la nostalgia entre los veteranos de la saga.",
            "El Vintage Vice City Pack fue anunciado cuando se abrieron las reservas el 25 de junio, pero hasta ahora Rockstar no había mostrado cómo se verían realmente los objetos en juego. Las nuevas screenshots confirman que el pack incluye al menos un vehículo clásico con líneas que evocan los muscle cars de los 80, varios conjuntos de ropa con chaquetas de chándal y gafas de sol estilo retro, y opciones de personalización para los protagonistas Lucia y Jason.",
            "Esta colección es especialmente significativa porque conecta dos épocas de la franquicia separadas por más de dos décadas. GTA: Vice City de 2002 fue, para muchos jugadores, su primer contacto con la saga y uno de los títulos más queridos de la era PS2. Que Rockstar rinda homenaje a esa entrega con contenido exclusivo de reserva sugiere que la compañía es consciente del peso nostálgico de Vice City y quiere aprovecharlo como gancho comercial.",
            "Más allá del pack retro, las nuevas capturas también muestran algunos ángulos inéditos de Vice City, incluyendo una vista panorámica del downtown al atardecer y un primer plano de uno de los clubs nocturnos que poblarán la ciudad. La calidad gráfica sigue siendo impresionante, con una iluminación global que hace que las luces de neón se reflejen de forma creíble en las superficies mojadas y en los cristales de los edificios.",
            "Quienes hayan reservado la Ultimate Edition, priced at 99.99 dólares, recibirán automáticamente el Vintage Vice City Pack junto con otros contenidos digitales adicionales. Los poseedores de la edición estándar también obtendrán el pack si reservan antes del 20 de noviembre, día antes del lanzamiento. Tras esa fecha, Rockstar ha confirmado que los objetos no estarán disponibles para compra por separado, lo que los convierte en un verdadero exclusivo de reserva.",
            "La actualización de la web oficial también ha añadido nuevas secciones descargables, incluyendo wallpapers en alta resolución para desktop y móvil, lo que sugiere que Rockstar está intensificando su presencia mediática de cara al lanzamiento. Con el «Extended Look» del 27 de agosto a la vuelta de la esquina, es de esperar que sigamos viendo comunicaciones graduales en las próximas semanas, manteniendo el interés sin saturar a la comunidad.",
        ],
    },
    # 18 ago
    {
        "slug": "analisis-extended-look-marketing-netflix-estrategia",
        "title": "¿Por qué Rockstar eligió Netflix para el Extended Look de GTA VI?",
        "excerpt": "El estreno del avance extendido de GTA VI en Netflix marca un cambio de paradigma en el marketing de videojuegos. Analizamos las razones estratégicas detrás de esta decisión.",
        "category": "noticias",
        "author": "diego-ramirez",
        "date": "2026-08-18T14:00:00Z",
        "cover_cat": "noticias",
        "cover_label": "Estrategia Netflix",
        "cover_alt": "Imagen conceptual del acuerdo Rockstar-Netflix para GTA VI",
        "tags": ["Netflix", "Marketing", "Take-Two", "Estrategia", "Streaming"],
        "reading_time": 6,
        "sources": [
            ("Rockstar Games - Anuncio Extended Look", "https://www.rockstargames.com/newswire"),
            ("Engadget - Cómo ver el Extended Look", "https://www.engadget.com"),
            ("G2A - Análisis estrategia marketing", "https://www.g2a.com"),
        ],
        "content": [
            "La decisión de Rockstar Games de estrenar «Grand Theft Auto VI: An Extended Look» en Netflix antes que en YouTube marca un cambio de paradigma en el marketing de los videojuegos AAA. Tradicionalmente, los grandes estudios han utilizado YouTube como plataforma casi exclusiva para sus comunicados, aprovechando su alcance masivo y su integración con la comunidad gamer. El salto a Netflix indica que Take-Two está pensando en audiencias más amplias.",
            "La razón principal es el alcance. Netflix supera los 250 millones de suscriptores en todo el mundo, una audiencia que no se limita a jugadores activos sino que incluye a consumidores generales de entretenimiento. Para una franquicia como GTA, que aspira a ser el evento cultural del año, llegar a este público amplio es fundamental. Muchos de los compradores potenciales de GTA VI no siguen canales de videojuegos en YouTube, pero sí tienen cuenta de Netflix.",
            "Otro factor clave es la percepción de prestigio. YouTube es la plataforma donde se publican todos los tráileres, desde indie hasta AAA, lo que puede restar singularidad al lanzamiento. Netflix, en cambio, se asocia con producciones de alta calidad y exclusividad. Que Rockstar elija Netflix para su primer avance extenso de gameplay sugiere que quiere posicionar GTA VI no solo como un videojuego, sino como un evento cultural comparable al estreno de una serie de prestigio.",
            "El hecho de que el contenido se publique seis horas después en YouTube también es relevante. Esta ventana de exclusividad crea un sentido de urgencia entre los fans más acérrimos, que se suscribirán o entrarán a Netflix solo para verlo en el estreno. Para Netflix, este tipo de acuerdos les permite atraer a audiencias que quizás no consumen su oferta habitual de series y películas, diversificando su base de usuarios.",
            "Take-Two ya había anticipado esta estrategia en mayo, cuando su CEO Strauss Zelnick describió la campaña de marketing de GTA VI como «significativa y diferente» a la de GTA V. La colaboración con Netflix encaja perfectamente con esa promesa. Es de esperar que veamos más acuerdos de este tipo en las semanas previas al lanzamiento del 19 de noviembre, posiblemente con otras plataformas de streaming, redes sociales o incluso marcas fuera del ecosistema gaming.",
            "La estrategia también responde a la evolución del consumo de contenido. Los tráileres cinematográficos tradicionales, de 1-2 minutos, están perdiendo relevancia frente a formatos más largos y narrativos. El término «Extended Look» sugiere que Rockstar está apostando por un formato más cercano al documental o al making-of, donde se pueda mostrar el juego con más contexto y profundidad. Si esta apuesta funciona, podría marcar un precedente para cómo se comercializan los grandes lanzamientos en el futuro.",
        ],
    },
    # 19 ago
    {
        "slug": "gta-vi-campana-marketing-miami-vice-city-irl",
        "title": "Miami prepara una campaña de marketing IRL que convertirá la ciudad en Vice City",
        "excerpt": "El ayuntamiento de Miami evalúa un acuerdo con Rockstar para transformar zonas de la ciudad en escenarios de Vice City durante la campaña de marketing de GTA VI.",
        "category": "noticias",
        "author": "sofia-torres",
        "date": "2026-08-19T18:30:00Z",
        "cover_cat": "noticias",
        "cover_label": "Miami IRL",
        "cover_alt": "Imagen conceptual de Miami transformada en Vice City para la campaña",
        "tags": ["Miami", "Marketing", "Vice City", "Campaña IRL", "Rockstar"],
        "reading_time": 6,
        "sources": [
            ("Polygon - GTA 6 toma Miami", "https://www.polygon.com"),
            ("Eurogamer - Campaña Miami", "https://www.eurogamer.net"),
        ],
        "content": [
            "El ayuntamiento de Miami está evaluando un acuerdo multimillonario con Rockstar Games para transformar zonas de la ciudad en escenarios de Vice City durante la campaña de marketing de Grand Theft Auto VI. La propuesta, que podría aprobarse en las próximas semanas, convertiría Miami en una versión en carne y hueso de la ciudad ficticia que inspiró el juego, con branding, logotipos y eventos temáticos distribuidos por los puntos más icónicos.",
            "La idea es que los residentes y turistas de Miami puedan vivir una experiencia inmersiva que difumine las fronteras entre el juego y la realidad. Ocean Drive, South Beach, Little Havana y el downtown serían algunos de los escenarios donde se instalarían elementos temáticos: desde carteles de neón con guiños a marcas ficticias de GTA como Cluckin' Bell o Sprunk, hasta vehículos clásicos de los 80 aparcados en zonas estratégicas para fotos.",
            "El acuerdo sería la culminación de la relación simbiótica entre Miami y la saga GTA. Desde que Rockstar lanzó GTA: Vice City en 2002, la ciudad real ha sido una pieza fundamental del imaginario colectivo del videojuego, y la inminente llegada de GTA VI ha reavivado el interés turístico por los lugares que inspiraron el juego. Miami ya ha visto un incremento de visitantes que buscan localizaciones icónicas como las que aparecerán en el nuevo título.",
            "Desde el punto de vista económico, la campaña sería un win-win para ambas partes. Rockstar obtendría una presencia mediática sin precedentes en una de las ciudades más visibles del mundo, mientras que Miami se beneficiaría del impacto turístico y de la cobertura mediática global. Estimaciones preliminares sugieren que la iniciativa podría generar millones en ingresos por turismo y exposición mediática, especialmente en los meses previos al lanzamiento del 19 de noviembre.",
            "La propuesta no está exenta de controversia. Algunos concejales han expresado preocupación por la imagen que la asociación con GTA, una franquicia históricamente criticada por su representación de la violencia y el crimen, podría proyectar sobre la ciudad. Sin embargo, los defensores argumentan que GTA es una obra de ficción satírica y que la campaña debe entenderse como una celebración cultural, no como una apología del estilo de vida criminal que parodia el juego.",
            "Si se aprueba, la campaña empezaría a mediados de octubre y se prolongaría hasta fin de año, abarcando el lanzamiento del juego y las semanas posteriores. Esto sugiere que Rockstar está planeando una ofensiva de marketing masiva en el último trimestre, con Miami como epicentro físico y otras iniciativas digitales y presenciales repartidas por el mundo. La conexión entre la ciudad real y la ficticia promete ser uno de los aspectos más memorables de la campaña de GTA VI.",
        ],
    },
    # 21 ago
    {
        "slug": "gta-vi-pre-carga-12-noviembre-confirmada",
        "title": "La pre-carga de GTA VI comenzará el 12 de noviembre, una semana antes del lanzamiento",
        "excerpt": "Rockstar ha confirmado que la pre-carga del juego estará disponible a partir del 12 de noviembre, permitiendo a los reservas descargar el título con antelación para jugarlo en el momento exacto del estreno.",
        "category": "fecha-lanzamiento",
        "author": "carlos-mendoza",
        "date": "2026-08-21T10:30:00Z",
        "cover_cat": "fecha-lanzamiento",
        "cover_label": "Pre-carga 12 nov",
        "cover_alt": "Imagen conceptual sobre la pre-carga de GTA VI",
        "tags": ["Pre-carga", "12 de noviembre", "Lanzamiento", "PS5", "Xbox Series"],
        "reading_time": 5,
        "sources": [
            ("Rockstar Support - Plataformas y ediciones", "https://support.rockstargames.com"),
            ("PlayStation Store - GTA VI", "https://www.playstation.com"),
            ("Xbox Store - GTA VI", "https://www.xbox.com"),
        ],
        "content": [
            "Rockstar Games ha confirmado que la pre-carga de Grand Theft Auto VI estará disponible a partir del 12 de noviembre de 2026, una semana antes del lanzamiento oficial previsto para el 19 de noviembre. La noticia, publicada en la página de soporte oficial del estudio, permite a los jugadores que hayan reservado el título descargarlo con antelación para poder jugarlo en el momento exacto del estreno, sin esperas.",
            "La pre-carga se habilitará simultáneamente en PlayStation Store y Microsoft Store para todos los usuarios que hayan reservado cualquiera de las dos ediciones del juego: la estándar a 79,99 dólares o la Ultimate Edition a 99,99 dólares. Aquellos que adquieran el juego después del 12 de noviembre también podrán pre-cargarlo, siempre y cuando lo hagan antes de la fecha de lanzamiento. La funcionalidad estará disponible tanto en PS5 como en PS5 Pro y Xbox Series X|S.",
            "El peso del archivo de instalación aún no se ha confirmado oficialmente, pero todo apunta a que será considerable. Considerando la densidad del mundo abierto, la calidad de las texturas vista en los tráileres y la cantidad de contenido esperada, los análisis técnicos sugieren que GTA VI podría ocupar entre 120 y 180 GB en consola. Esto hace especialmente valiosa la opción de pre-carga, ya que descargar un archivo de ese tamaño el día del lanzamiento podría llevar varias horas.",
            "Para los jugadores de Xbox, la pre-carga se realizará automáticamente en segundo plano una vez reservado el juego, siempre y cuando se tenga activada la opción de descarga automática en la consola. En PlayStation, los usuarios deberán acceder manualmente a la biblioteca y seleccionar la opción de descargar. En ambos casos, el juego no será jugable hasta el momento exacto del lanzamiento, que corresponderá a la medianoche del 19 de noviembre en cada zona horaria.",
            "La estrategia de pre-carga una semana antes es cada vez más común en lanzamientos AAA, ya que permite maximizar las ventas del primer día. Al eliminar la barrera de la descarga, los jugadores pueden empezar a jugar en el momento exacto del estreno, lo que genera un pico de actividad online que se traduce en mayor visibilidad en redes sociales y más presión sobre quienes aún no han comprado el juego. Rockstar ya empleó esta estrategia con GTA V y Red Dead Redemption 2 con resultados excelentes.",
            "Con la pre-carga confirmada para el 12 de noviembre, los fans ya pueden planificar su countdown personal hacia el lanzamiento. Muchos jugadores ya han pedido días libres en sus trabajos, organizado eventos de lanzamiento con amigos y preparado su hardware para asegurar la mejor experiencia posible. La cuenta atrás para el que probablemente sea el lanzamiento más esperado de la década ha comenzado oficialmente.",
        ],
    },
    # 22 ago
    {
        "slug": "gta-vi-peso-instalacion-estimacion-tamano",
        "title": "¿Cuánto pesará GTA VI? Estimaciones sobre el tamaño de instalación",
        "excerpt": "Aunque Rockstar no ha confirmado el peso oficial, los análisis técnicos apuntan a que GTA VI podría ocupar entre 120 y 180 GB en consola, lo que le convertiría en uno de los juegos más pesados de la generación.",
        "category": "gameplay",
        "author": "diego-ramirez",
        "date": "2026-08-22T12:15:00Z",
        "cover_cat": "gameplay",
        "cover_label": "Tamaño instalación",
        "cover_alt": "Imagen conceptual sobre el tamaño de instalación de GTA VI",
        "tags": ["Peso", "Instalación", "GB", "Almacenamiento", "SSD"],
        "reading_time": 5,
        "sources": [
            ("Rockstar Support - Plataformas", "https://support.rockstargames.com"),
            ("Digital Foundry - Análisis técnico", "https://www.digitalfoundry.net"),
        ],
        "content": [
            "A falta de confirmación oficial por parte de Rockstar Games, los análisis técnicos sobre el tamaño de instalación de Grand Theft Auto VI apuntan a que el juego podría ocupar entre 120 y 180 GB en consola, lo que le convertiría en uno de los títulos más pesados de la actual generación. Esta estimación se basa en la densidad del mundo abierto, la calidad de las texturas vista en los tráileres y la cantidad de contenido esperada, incluyendo el modo historia, las actividades secundarias y el futuro modo online.",
            "Para poner esta cifra en contexto, GTA V en su versión de PS5 y Xbox Series X|S ocupa actualmente alrededor de 95 GB, mientras que Red Dead Redemption 2, el juego más reciente de Rockstar, alcanza los 150 GB en consola. Si GTA VI crece proporcionalmente respecto a sus predecesores, considerando la mayor densidad del mundo abierto, los interiores accesibles, la fauna variada y el nuevo motor RAGE actualizado, las estimaciones de 120-180 GB son plenamente razonables.",
            "El tamaño de instalación plantea un desafío para los jugadores con almacenamiento limitado. Las consolas de la actual generación vienen con SSDs de entre 512 GB (Xbox Series S) y 1 TB (PS5, Xbox Series X), pero tras restar el espacio ocupado por el sistema operativo y otros juegos, muchos usuarios tendrán que gestionar su biblioteca para hacer sitio. Es probable que muchos jugadores opten por expandir el almacenamiento con un SSD NVMe compatible en las semanas previas al lanzamiento.",
            "El peso del juego también tiene implicaciones para la pre-carga, que comenzará el 12 de noviembre. Descargar 150 GB puede llevar varias horas incluso con conexiones de alta velocidad. Para una conexión de 100 Mbps, la descarga tomaría aproximadamente 3,5 horas en condiciones óptimas; para conexiones más lentas de 30 Mbps, el tiempo se extiende hasta las 12 horas. Los jugadores con conexiones modestas deberán planificar con antelación para no encontrarse con la descarga incompleta el día del lanzamiento.",
            "Una de las incógnitas es cómo Rockstar gestionará la compresión de archivos. El estudio ha demostrado en el pasado una capacidad excepcional para optimizar el almacenamiento sin sacrificar calidad visual, pero GTA VI representa un salto generacional en cuanto a densidad de contenido. Sería razonable esperar que el estudio utilice técnicas avanzadas de compresión de texturas y audio para mantener el tamaño dentro de límites manejables, aunque el resultado final seguirá siendo uno de los juegos más pesados del mercado.",
            "Para la versión de PC, que llegará en una fecha posterior no anunciada, el tamaño podría ser incluso mayor. Las versiones de PC suelen incluir texturas en resoluciones más altas, opciones de audio sin compresión y archivos adicionales para soportar la variedad de configuraciones hardware. Quienes planeen jugar en PC cuando llegue el momento deberían preparar al menos 200 GB de espacio libre para asegurar una instalación sin problemas.",
        ],
    },
    # 23 ago
    {
        "slug": "rockstar-90-screenshots-galeria-oficial",
        "title": "La galería oficial de GTA VI alcanza las 99 capturas de pantalla",
        "excerpt": "La web oficial de Rockstar Games ha alcanzado las 99 screenshots de GTA VI, con la última tanda dedicada a mostrar el Vintage Vice City Pack y nuevos ángulos de Vice City.",
        "category": "noticias",
        "author": "sofia-torres",
        "date": "2026-08-23T16:45:00Z",
        "cover_cat": "noticias",
        "cover_label": "99 Screenshots",
        "cover_alt": "Imagen conceptual sobre las 99 capturas de pantalla oficiales de GTA VI",
        "tags": ["Screenshots", "Galería oficial", "99 capturas", "Rockstar", "Vice City"],
        "reading_time": 5,
        "sources": [
            ("Rockstar Games - Galería oficial", "https://www.rockstargames.com/gta-vi"),
            ("Resetera - 99 screenshots", "https://www.resetera.com"),
        ],
        "content": [
            "La galería oficial de Grand Theft Auto VI en la web de Rockstar Games ha alcanzado la impresionante cifra de 99 capturas de pantalla, todas ellas disponibles para descarga gratuita en alta resolución. La última tanda, publicada en las últimas horas, está dedicada al Vintage Vice City Pack y a nuevos ángulos de Vice City que muestran la ciudad bajo condiciones de iluminación inéditas, desde el amanecer hasta la madrugada profunda.",
            "Rockstar ha venido publicando capturas de forma gradual desde junio, cuando se abrieron las reservas del juego. En total, ya son casi un centenar de imágenes que muestran distintos aspectos del juego: los protagonistas Lucia y Jason en diversas situaciones, paisajes urbanos y naturales de Leonida, vehículos clásicos y modernos, interiores de locales, personalización de personajes y secuencias de acción que sugieren algunas de las misiones que encontraremos en la campaña principal.",
            "Lo más destacado de las últimas capturas es la calidad técnica. La iluminación global en tiempo real es evidente en cada imagen, con sombras que se proyectan de forma creíble según la posición del sol, reflejos en superficies mojadas que sugieren el uso de ray tracing parcial, y una densidad de NPCs y vehículos en las calles que supera cualquier entrega anterior de la saga. Los primeros planos de los personajes muestran un nivel de detalle en las expresiones faciales y las texturas de piel que se acerca al fotorrealismo.",
            "La galería también incluye varias capturas que muestran el Vintage Vice City Pack en acción. Se pueden ver vehículos con líneas retro de los 80, conjuntos de ropa con chaquetas de chándal y gafas de sol estilo Miami Vice, y opciones de personalización para Lucia y Jason que evocan la estética de la Vice City original de 2002. Para los veteranos de la saga, estas imágenes son un regalo nostálgico que conecta dos épocas de la franquicia.",
            "Rockstar ofrece todas las capturas en descarga gratuita en formatos de alta resolución para desktop y móvil, lo que sugiere que el estudio está fomentando activamente que los fans las compartan en redes sociales, las usen como wallpapers o las analicen en busca de detalles ocultos. Esta estrategia de publicación gradual ha mantenido el interés de la comunidad durante meses, generando un flujo constante de conversaciones, teorías y análisis en foros como GTAForums, Reddit y Resetera.",
            "Con 99 capturas y contando, es de esperar que Rockstar siga publicando nuevas tandas en las semanas previas al lanzamiento del 19 de noviembre. La galería podría superar fácilmente las 150 imágenes antes de que el juego llegue al mercado, lo que la convertiría en una de las campañas de comunicación visual más ambiciosas de la historia del videojuego. Quienes quieran revisar todas las capturas pueden hacerlo en la sección oficial de la web de Rockstar Games, donde también hay wallpapers y artworks descargables.",
        ],
    },
    # 24 ago
    {
        "slug": "gta-vi-ps5-pro-funciones-confirmadas",
        "title": "PS5 Pro recibirá mejoras exclusivas de GTA VI, según filtraciones de minoristas",
        "excerpt": "Filtraciones de Amazon y minoristas brasileños sugieren que la PS5 Pro recibirá mejoras específicas en GTA VI, incluyendo resolución aumentada y posiblemente framerate superior.",
        "category": "gameplay",
        "author": "diego-ramirez",
        "date": "2026-08-24T11:30:00Z",
        "cover_cat": "gameplay",
        "cover_label": "PS5 Pro",
        "cover_alt": "Imagen conceptual sobre las funciones de GTA VI en PS5 Pro",
        "tags": ["PS5 Pro", "Resolución", "Framerate", "Sony", "PlayStation"],
        "reading_time": 6,
        "sources": [
            ("Vice - Features filtradas y PS5 Pro", "https://www.vice.com"),
            ("PlayStation Store - GTA VI", "https://www.playstation.com"),
        ],
        "content": [
            "Las filtraciones procedentes de Amazon y minoristas brasileños sugieren que la PlayStation 5 Pro recibirá mejoras exclusivas en Grand Theft Auto VI, aprovechando el hardware mejorado de la consola de Sony. Aunque Rockstar aún no ha confirmado oficialmente las funciones específicas, todo apunta a que los poseedores de la versión Pro disfrutarán de una experiencia visualmente superior respecto a la PS5 estándar.",
            "Las filtraciones mencionan específicamente «PS5 Pro Enhancements» como una de las funciones destacadas del juego en la lista de características. Esto podría traducirse en varias mejoras concretas: resolución dinámica más alta, posiblemente alcanzando 4K nativo en más momentos que la PS5 estándar; framerate más estable en el modo calidad; uso más extensivo del ray tracing para reflejos y sombras; y posiblemente un modo híbrido que combine 60 fps con calidad gráfica elevada, algo que en PS5 estándar será difícil de lograr.",
            "La PS5 Pro, lanzada a finales de 2024, cuenta con una GPU más potente que la PS5 estándar, con más unidades de cómputo y mayor ancho de banda de memoria. Esto le permite manejar escenas más complejas con mayor fluidez y aplicar técnicas avanzadas como el upscaling basado en machine learning, similar al DLSS de Nvidia. Si Rockstar aprovecha estas capacidades, los poseedores de PS5 Pro podrían disfrutar de la mejor versión de GTA VI en consola, por delante incluso de Xbox Series X.",
            "La confirmación de mejoras específicas para PS5 Pro tiene sentido comercial para Rockstar y Sony. Para Sony, supone un argumento extra para que los jugadores actualicen desde PS5 estándar a PS5 Pro, especialmente aquellos que planean comprar GTA VI en su consola. Para Rockstar, garantiza que el juego se vea lo mejor posible en la plataforma líder del mercado, lo que contribuye a la percepción de calidad que rodea al lanzamiento.",
            "Sin embargo, la noticia también ha generado cierta frustración entre los poseedores de PS5 estándar y Xbox Series X, que temen quedar rezagados respecto a la versión Pro. Históricamente, las mejoras entre versiones de consolas dentro de la misma generación han sido marginales, pero el caso de GTA VI, con su énfasis en la calidad visual, podría marcar una diferencia más notable de lo habitual. Rockstar tendrá que equilibrar cuidadosamente las versiones para no alienar a los poseedores de hardware más modesto.",
            "En cualquier caso, la confirmación oficial de las mejoras de PS5 Pro llegará probablemente en las semanas previas al lanzamiento del 19 de noviembre, posiblemente durante el «Extended Look» del 27 de agosto o en comunicaciones posteriores. Los poseedores de PS5 Pro que planeen comprar GTA VI pueden estar tranquilos: su inversión en el hardware mejorado de Sony se verá recompensada con una experiencia visualmente superior, aunque los detalles concretos aún estén por confirmar.",
        ],
    },
    # 25 ago
    {
        "slug": "gta-vi-rage-engine-mejoras-tecnicas",
        "title": "El motor RAGE de GTA VI: las mejoras técnicas que marcarán la diferencia",
        "excerpt": "Rockstar ha actualizado profundamente su motor propietario RAGE para GTA VI, con mejoras en iluminación global, IA, físicas y gestión de NPCs que prometen redefinir el estándar del mundo abierto.",
        "category": "gameplay",
        "author": "diego-ramirez",
        "date": "2026-08-25T13:00:00Z",
        "cover_cat": "gameplay",
        "cover_label": "RAGE Engine",
        "cover_alt": "Imagen conceptual sobre el motor RAGE de GTA VI",
        "tags": ["RAGE", "Motor", "IA", "Iluminación global", "Físicas"],
        "reading_time": 7,
        "sources": [
            ("Digital Foundry - Análisis técnico tráiler 2", "https://www.digitalfoundry.net"),
            ("Rockstar Games - Página oficial", "https://www.rockstargames.com/gta-vi"),
        ],
        "content": [
            "El motor RAGE (Rockstar Advanced Game Engine), propietario de Rockstar Games desde GTA IV, ha sido profundamente actualizado para Grand Theft Auto VI, con mejoras en iluminación global, inteligencia artificial, físicas y gestión de NPCs que prometen redefinir el estándar del mundo abierto en la actual generación de consolas. El análisis técnico de Digital Foundry sobre los tráileres publicados hasta ahora confirma un salto cualitativo respecto a entregas anteriores.",
            "Una de las mejoras más evidentes es la iluminación global en tiempo real. En GTA V y Red Dead Redemption 2, la iluminación ya era impresionante, pero se basaba en técnicas precomputadas o en soluciones parciales. En GTA VI, el motor RAGE actualizado es capaz de calcular la iluminación global frame a frame, lo que permite que la luz rebote de forma realista entre superficies, que las sombras se proyecten con precisión milimétrica y que los cambios de hora del día se produzcan sin transiciones bruscas.",
            "El sistema de IA de NPCs también ha recibido una actualización significativa. Las filtraciones de 2022 y los tráileres posteriores muestran NPCs con comportamientos mucho más ricos y variados que en entregas anteriores. Cada personaje no jugador parece tener su propia rutina, personalidad y relaciones con otros NPCs, lo que promete un mundo que se siente verdaderamente vivo. Los reaccionamientos a las acciones del jugador son más naturales, y los NPCs pueden ser vistos trabajando, socializando o reaccionando a incidentes de forma creíble.",
            "Las físicas también se han mejorado considerablemente. Los vehículos tienen un modelo de daños detallado, con deformaciones que reflejan el tipo y la fuerza del impacto. Los barcos, que tendrán un papel protagonista dada la importancia de la navegación en el mapa de Leonida, presentan un comportamiento acuático realista con olas que afectan a su manejo y estelas que se forman tras la embarcación. Las físicas de ragdoll en los personajes también se han refinado, con animaciones más naturales durante caídas, golpes y accidentes.",
            "La gestión de NPCs es otra de las áreas donde RAGE ha dado un salto cualitativo. GTA VI promete calles densamente pobladas, con cientos de personajes simultáneos en pantalla, cada uno con su propio comportamiento y apariencia. Esto requiere un sistema de streaming de datos altamente optimizado, capaz de cargar y descargar modelos, texturas y animaciones sobre la marcha sin que el jugador perciba cortes ni caídas de framerate. El SSD de las consolas de nueva generación es clave para hacer esto posible.",
            "La integración fluida entre interiores y exteriores, una de las novedades más esperadas de GTA VI, también depende de mejoras en el motor. RAGE actualizado permite moverse entre el exterior y el interior de los edificios sin pantallas de carga, lo que abre nuevas posibilidades para misiones, exploración y combate. Esto requiere un sistema de ocultación y carga de geometría extremadamente eficiente, capaz de gestionar entornos cerrados y abiertos de forma simultánea sin penalizar el rendimiento.",
            "Con un presupuesto de desarrollo que, según Take-Two, podría alcanzar los 2.000 millones de dólares, no es de extrañar que Rockstar haya invertido años de trabajo en modernizar su motor propietario. El resultado, si los tráileres son indicativo, será uno de los mundos abiertos más impresionantes técnicamente de la historia, capaz de exprimir hasta el último recurso de las consolas de nueva generación. Cuando el juego llegue el 19 de noviembre, los jugadores podrán comprobar de primera mano el trabajo realizado en RAGE.",
        ],
    },
    # 26 ago
    {
        "slug": "rockstar-statement-nearly-there-noviembre-confirmado",
        "title": "Rockstar emite un comunicado: GTA VI está 'casi listo' y se mantiene el 19 de noviembre",
        "excerpt": "En respuesta a los rumores de la última semana, Rockstar ha emitido un comunicado confirmando que GTA VI está 'casi listo' y que la fecha del 19 de noviembre se mantiene sin cambios.",
        "category": "fecha-lanzamiento",
        "author": "carlos-mendoza",
        "date": "2026-08-26T17:00:00Z",
        "cover_cat": "fecha-lanzamiento",
        "cover_label": "Nearly There",
        "cover_alt": "Imagen conceptual sobre el comunicado de Rockstar",
        "tags": ["Rockstar", "Comunicado", "Noviembre 2026", "Sin retrasos", "Nearly there"],
        "reading_time": 5,
        "sources": [
            ("GTABoom - Rockstar GTA 6 statement", "https://www.gtaboom.com"),
            ("GTABoom - Rockstar addresses leaks", "https://www.gtaboom.com"),
        ],
        "content": [
            "Rockstar Games ha emitido un comunicado oficial en el que describe Grand Theft Auto VI como «nearly there» (casi listo) y confirma que la fecha de lanzamiento del 19 de noviembre de 2026 se mantiene sin cambios. El comunicado, publicado el 26 de agosto, llega en respuesta a los rumores de la última semana sobre un posible retraso y a las filtraciones de material de desarrollo que habían circulado por foros y redes sociales.",
            "La declaración también aborda las filtraciones recientes, calificándolas de «heartbreaking» (desoladoras) para el equipo de desarrollo, pero tranquilizando a la comunidad al confirmar que no afectarán al calendario de lanzamiento. Rockstar aprovecha para pedir a los fans que esperen a las comunicaciones oficiales y eviten consumir material filtrado que no representa la calidad final del producto. Es la primera vez que el estudio se pronuncia públicamente sobre las filtraciones desde el episodio masivo de septiembre de 2022.",
            "El término «nearly there» es significativo. Sugiere que el desarrollo del juego ha entrado en su fase final, centrada en pulir detalles, corregir bugs y optimizar el rendimiento, más que en añadir contenido nuevo. Esta fase, conocida en la industria como «crunch» o «gold mastering», suele durar entre 3 y 6 meses en proyectos de la escala de GTA VI, lo que encaja perfectamente con un lanzamiento previsto para noviembre de 2026, a tres meses vista desde el comunicado.",
            "La confirmación de que la fecha se mantiene ha sido recibida con alivio por la comunidad, que temía un nuevo retraso después de los ajustes anteriores. Originalmente, GTA VI estaba previsto para primavera de 2025, posteriormente se movió a mayo de 2026 y finalmente al 19 de noviembre de 2026. Cada movimiento generó frustración entre los fans, y la posibilidad de un cuarto retraso había sido tema de conversación intensa en foros y redes durante las últimas semanas, alimentada por filtraciones que sugerían problemas en el desarrollo.",
            "El comunicado también menciona el «Extended Look» del 27 de agosto, presentándolo como una muestra del progreso del desarrollo y como un adelanto de lo que los jugadores pueden esperar en noviembre. Esto sugiere que el avance extenso mostrará gameplay real capturado en PS5, no cinemáticas pre-renderizadas, lo que permitirá a los fans juzgar el estado real del juego. Si el resultado es pulido, muchos de los temores sobre un retraso se disiparán definitivamente.",
            "Con el comunicado emitido y la fecha confirmada oficialmente por tercera vez, los fans pueden respirar tranquilos. Salvo catástrofe imprevista, GTA VI llegará el 19 de noviembre de 2026 en PS5, PS5 Pro y Xbox Series X|S. Las próximas semanas, marcadas por el «Extended Look» del 27 de agosto y las comunicaciones graduales de Rockstar, prometen ser intensas en términos de marketing y revelations sobre el juego. La cuenta atrás para el lanzamiento más esperado de la década entra en su recta final.",
        ],
    },
    # 29 ago
    {
        "slug": "rockstar-29-nuevas-screenshots-jason-lucia",
        "title": "Rockstar publica 29 nuevas screenshots centradas en Jason y Lucia",
        "excerpt": "La galería oficial de GTA VI se actualiza con 29 nuevas capturas, encabezadas por la primera colección dedicada exclusivamente a los protagonistas Jason y Lucia en diversas situaciones.",
        "category": "noticias",
        "author": "sofia-torres",
        "date": "2026-08-29T19:30:00Z",
        "cover_cat": "personajes",
        "cover_label": "Jason & Lucia",
        "cover_alt": "Imagen conceptual de los nuevos screenshots de Jason y Lucia",
        "tags": ["Screenshots", "Jason", "Lucia", "Personajes", "Galería oficial"],
        "reading_time": 5,
        "sources": [
            ("GTA Intel - 29 new screenshots", "https://gtaintel.com"),
            ("Rockstar Games - Galería oficial", "https://www.rockstargames.com/gta-vi"),
        ],
        "content": [
            "La galería oficial de Grand Theft Auto VI en la web de Rockstar Games se ha actualizado con 29 nuevas capturas de pantalla, encabezadas por la primera colección dedicada exclusivamente a los protagonistas Jason Duval y Lucia Caminos en diversas situaciones. La tanda, publicada dos días después del «Extended Look» del 27 de agosto, mantiene el ritmo de comunicaciones graduales que caracteriza la campaña de marketing del juego.",
            "Las nuevas capturas muestran a Jason y Lucia en una variedad de contextos que sugieren algunas de las situaciones que vivirán durante la campaña principal. Hay imágenes de los dos personajes juntos en interiores, posiblemente en su casa o en un refugio, conversando o planeando algún golpe. Otras capturas los muestran en vehículos, ya sea durante una conducción tranquila por Vice City o en plena persecución. También hay primeras planos de cada uno por separado, permitiendo apreciar el nivel de detalle de los modelos de personajes.",
            "Lo más destacado de esta tanda es la calidad técnica de los modelos de Jason y Lucia. Los rostros muestran una fidelidad casi fotorrealista, con poros de piel visibles, peinados con movimiento natural y expresiones faciales que transmiten emociones genuinas. La iluminación global en tiempo real se hace especialmente evidente en los primeros planos, donde la luz incide de forma creíble sobre los rasgos faciales y proyecta sombras suaves que refuerzan el realismo.",
            "Las capturas también muestran por primera vez opciones de personalización de los protagonistas. Se pueden ver a Lucia y Jason con diferentes conjuntos de ropa, lo que confirma que el sistema de personalización será más profundo que en GTA V, donde cada protagonista tenía un armario limitado. La ropa no parece ser solo estética: algunas capturas sugieren que los NPCs reaccionarán de forma diferente según el aspecto de los protagonistas, añadiendo una capa de inmersión extra.",
            "Junto con las capturas centradas en Jason y Lucia, la tanda incluye imágenes de Vice City en distintas horas del día, vehículos clásicos y modernos, y algunas localizaciones rurales que podrían corresponder a las regiones de Grassrivers o Ambrosia. Esta variedad sugiere que el juego tendrá una amplia gama de entornos y situaciones, desde la vida urbana en Vice City hasta la exploración de zonas naturales en el estado de Leonida.",
            "Con esta actualización, la galería oficial de GTA VI supera las 120 capturas, consolidándose como una de las campañas de comunicación visual más ambiciosas de la historia del videojuego. Rockstar continúa publicando nuevas tandas a un ritmo constante, manteniendo el interés de la comunidad sin saturarla. Con menos de tres meses para el lanzamiento del 19 de noviembre, es de esperar que sigamos viendo capturas y comunicaciones regulares hasta que el juego llegue finalmente a las tiendas.",
        ],
    },
    # 30 ago
    {
        "slug": "extended-look-analisis-implicaciones-marketing",
        "title": "Análisis: lo que el Extended Look de GTA VI significa para la campaña de marketing",
        "excerpt": "Tres días después del estreno en Netflix, analizamos las implicaciones del Extended Look de GTA VI para la estrategia de marketing de Rockstar y Take-Two de cara al lanzamiento de noviembre.",
        "category": "trailers",
        "author": "carlos-mendoza",
        "date": "2026-08-30T15:00:00Z",
        "cover_cat": "trailers",
        "cover_label": "Análisis Extended Look",
        "cover_alt": "Imagen conceptual sobre el análisis del Extended Look de GTA VI",
        "tags": ["Extended Look", "Marketing", "Análisis", "Take-Two", "Netflix"],
        "reading_time": 7,
        "sources": [
            ("New York Times - GTA VI Extended Look", "https://www.nytimes.com"),
            ("Netflix - GTA VI Extended Look", "https://www.netflix.com"),
            ("Rockstar Games - Página oficial", "https://www.rockstargames.com/gta-vi"),
        ],
        "content": [
            "Tres días después del estreno de «Grand Theft Auto VI: An Extended Look» en Netflix, las implicaciones para la estrategia de marketing de Rockstar y Take-Two comienzan a clarificarse. El avance, capturado íntegramente en PlayStation 5, ha sido recibido con enorme entusiasmo por la comunidad y ha generado conversaciones intensas en redes sociales, foros y medios especializados durante todo el fin de semana, superando incluso las expectativas más optimistas del estudio.",
            "El análisis del New York Times, uno de los pocos medios generalistas que se ha hecho eco del avance, destaca la ambición de lo mostrado: carreras de stock-car, paracaidismo, navegación por humedales, y una variedad de actividades que sugieren un mundo abierto más rico y diverso que cualquier entrega anterior de la saga. El periódico neoyorquino califica el avance como una muestra de las «grandes ambiciones» de Rockstar para con el título, sugiriendo que GTA VI aspira a redefinir el género del mundo abierto.",
            "Desde el punto de vista de marketing, el Extended Look ha cumplido su función principal: mantener el interés de la comunidad y generar conversación positiva en las semanas previas al lanzamiento. La elección de Netflix como plataforma de estreno ha resultado acertada, atrayendo atención de audiencias que no siguen habitualmente los comunicados de videojuegos. Las métricas de visualización, aunque no se han hecho públicas, parecen haber superado las expectativas de Take-Two según fuentes internas citadas por la prensa especializada.",
            "El formato del avance, más largo y narrativo que un tráiler tradicional, ha permitido a Rockstar mostrar el juego en movimiento con más contexto. Esto ha sido especialmente valioso para confirmar que las mecánicas prometidas —IA avanzada de NPCs, interiores accesibles, navegación, sistema de combustible— funcionan como se había anunciado. La comunidad ha reaccionado positivamente al ver que las promesas técnicas se cumplen, lo que refuerza la confianza en que el lanzamiento del 19 de noviembre no sufrirá nuevos retrasos.",
            "La estrategia de publicar el avance primero en Netflix y seis horas después en YouTube también ha funcionado. La ventana de exclusividad generó un sentido de urgencia entre los fans más acérrimos, que se suscribieron temporalmente a Netflix solo para verlo en el estreno. Para Netflix, este tipo de acuerdos les permite atraer a audiencias que quizás no consumen su oferta habitual, diversificando su base de usuarios. Es probable que veamos más colaboraciones de este tipo en el futuro, tanto de Rockstar como de otros estudios AAA.",
            "Para Take-Two, el Extended Look marca el inicio de la fase final de la campaña de marketing de GTA VI. Con menos de tres meses para el lanzamiento, es de esperar que las próximas semanas traigan más comunicaciones: nuevas tandas de screenshots, posibles eventos presenciales, colaboraciones con marcas y, posiblemente, un tercer tráiler cinematográfico más cercano al lanzamiento. El «significativo y diferente» marketing que prometió Strauss Zelnick está empezando a tomar forma, y todo apunta a que será uno de los más ambiciosos de la historia del videojuego.",
            "El impacto del Extended Look también se hará sentir en las reservas del juego. Tras el avance, es probable que muchos jugadores que aún dudaban se decidan a reservar, especialmente considerando que la bonificación del Vintage Vice City Pack solo estará disponible para quienes reserven antes del 20 de noviembre. Con la pre-carga empezando el 12 de noviembre, los poseedores de reserva podrán empezar a descargar el juego una semana antes del estreno, lo que se traducirá en un pico de actividad online el 19 de noviembre sin precedentes en la industria.",
        ],
    },
    # 31 ago
    {
        "slug": "rockstar-nuevas-screenshots-personalizacion-vice-city",
        "title": "Nuevas screenshots muestran personalización y la skyline de Vice City",
        "excerpt": "Rockstar ha publicado nuevas capturas de GTA VI que muestran opciones de personalización de personajes y la impresionante skyline de Vice City al atardecer.",
        "category": "noticias",
        "author": "sofia-torres",
        "date": "2026-08-31T18:20:00Z",
        "cover_cat": "noticias",
        "cover_label": "Skyline Vice City",
        "cover_alt": "Imagen conceptual de la skyline de Vice City en GTA VI",
        "tags": ["Screenshots", "Personalización", "Vice City", "Skyline", "Rockstar"],
        "reading_time": 5,
        "sources": [
            ("Vice - New GTA 6 screenshots", "https://www.vice.com"),
            ("Rockstar Games - Galería oficial", "https://www.rockstargames.com/gta-vi"),
        ],
        "content": [
            "Rockstar Games ha publicado nuevas capturas de pantalla de Grand Theft Auto VI que muestran opciones de personalización de personajes y la impresionante skyline de Vice City al atardecer. La tanda, publicada el 31 de agosto, continúa la estrategia de comunicaciones graduales que ha venido caracterizando la campaña de marketing del juego, manteniendo el interés de la comunidad sin saturarla en las semanas previas al lanzamiento del 19 de noviembre.",
            "Las capturas dedicadas a la personalización muestran a Jason y Lucia con varios conjuntos de ropa diferentes, confirmando que el sistema de armario será más profundo que en GTA V. Se pueden ver atuendos casuales, ropa más formal, conjuntos deportivos y opciones con clara inspiración retro para el Vintage Vice City Pack. La calidad del modelado de las prendas es impresionante, con caídas de tela realistas y detalles como costuras, cremalleras y logos perfectamente visibles.",
            "La screenshot más comentada de la tanda muestra la skyline de Vice City al atardecer, con el sol cayendo detrás de los rascacielos del downtown y tiñendo el cielo de tonos rosados, naranjas y púrpuras. La iluminación global en tiempo real se hace especialmente evidente en esta imagen, con las luces de las ventanas de los edificios encendiéndose progresivamente conforme cae la noche. La silueta de palmeras en primer plano completa una estética que evoca claramente el Miami real, pero con el toque estilizado característico de la saga GTA.",
            "Otras capturas muestran vehículos en distintas situaciones: muscle cars clásicos aparcados en zonas costeras, motos de alta cilindrada circulando por autopistas, y barcos surcando las aguas turquesas de las Leonida Keys. La variedad de vehículos sugiere que el garaje de GTA VI será uno de los más extensos de la saga, con opciones para todos los gustos: desde coches deportivos hasta vehículos utilitarios, pasando por embarcaciones y posiblemente aeronaves.",
            "Las capturas también muestran algunos ángulos inéditos de interiores, sugiriendo la variedad de localizaciones que los jugadores podrán explorar dentro de los edificios. Se ven locales nocturnos con luces de neón, tiendas con escaparates cuidadosamente detallados, y lo que parece ser un gimnasio o centro deportivo. La integración fluida entre interiores y exteriores, una de las novedades más esperadas de GTA VI, promete revolucionar la forma en que los jugadores interactúan con el mundo abierto.",
            "Con esta nueva tanda, la galería oficial de GTA VI sigue creciendo a un ritmo constante, consolidándose como una de las campañas de comunicación visual más ambiciosas de la historia del videojuego. Rockstar continúa publicando nuevas capturas cada pocos días, manteniendo el interés de la comunidad y generando conversación en foros y redes sociales. Con menos de tres meses para el lanzamiento, es de esperar que el ritmo se mantenga o incluso se intensifique en las próximas semanas, a medida que nos acerquemos al 19 de noviembre.",
        ],
    },
]

# Generar el bloque TS
output = []
for a in ARTICLES:
    output.append(TEMPLATE.format(
        slug=a["slug"],
        title=ts(a["title"]),
        excerpt=ts(a["excerpt"]),
        content=ts_array(a["content"]),
        category=a["category"],
        author=a["author"],
        publishedAt=a["date"],
        cover_cat=a["cover_cat"],
        cover_label=a["cover_label"],
        cover_alt=ts(a["cover_alt"]),
        tags=ts_array(a["tags"]),
        reading_time=a["reading_time"],
        sources=ts_sources(a["sources"]),
    ))

with open("/tmp/new_articles_part1.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print(f"Generados {len(ARTICLES)} artículos en /tmp/new_articles_part1.txt")
print(f"Tamaño: {sum(len(a['content']) for a in ARTICLES)} párrafos totales")
