-- 007_seed_module_tips.sql
-- 75 new daily tips for 5 new health modules (EN + ES)
-- Tip orders 51–125

INSERT INTO daily_tips (category, module, content_en, content_es, tip_order) VALUES

-- ── RESPIRATORY (15 tips) ──────────────────────────────────────────────────
('respiratory_care', 'respiratory',
 'French Bulldogs have Brachycephalic Obstructive Airway Syndrome (BOAS) by default. Their narrow nostrils, elongated soft palate, and narrow trachea mean every breath takes more effort than it does for other breeds.',
 'Los Bulldogs Franceses tienen Síndrome Braquicéfalo Obstructivo de las Vías Respiratorias (BOAS) por defecto. Sus fosas nasales estrechas, paladar blando alargado y tráquea angosta hacen que cada respiración requiera más esfuerzo que en otras razas.',
 51),

('respiratory_care', 'respiratory',
 'Never exercise your Frenchie in temperatures above 24°C (75°F). Their inability to pant effectively means they cannot cool down fast enough. Morning walks before 8 AM and evening walks after 7 PM are the safe windows in summer.',
 'Nunca ejercites a tu Frenchie a temperaturas superiores a 24°C. Su incapacidad para jadear eficientemente significa que no pueden enfriarse lo suficientemente rápido. Las caminatas matutinas antes de las 8 AM y vespertinas después de las 7 PM son las ventanas seguras en verano.',
 52),

('respiratory_care', 'respiratory',
 'Signs of respiratory distress in Frenchies: loud, raspy breathing at rest, open-mouth breathing when calm, blue or purple-tinged gums or tongue, neck extended and elbows flared. Any of these = immediate vet care.',
 'Señales de dificultad respiratoria en Frenchies: respiración ruidosa y rasposa en reposo, respiración con la boca abierta estando tranquilo, encías o lengua azuladas o moradas, cuello extendido y codos abiertos. Cualquiera de estas = atención veterinaria inmediata.',
 53),

('respiratory_care', 'respiratory',
 'Excitement and stress can trigger respiratory episodes. Greet your Frenchie calmly — jumping, spinning, and overexcitement raise oxygen demand rapidly, which their airways struggle to meet.',
 'La emoción y el estrés pueden desencadenar episodios respiratorios. Saluda a tu Frenchie con calma — saltar, girar y sobreexcitarse aumentan rápidamente la demanda de oxígeno, que sus vías respiratorias tienen dificultades para satisfacer.',
 54),

('respiratory_care', 'respiratory',
 'Overweight Frenchies have significantly worse respiratory function. Every extra kilogram of body fat compresses the airway and makes breathing harder. Weight control is the single most impactful thing you can do for BOAS management.',
 'Los Frenchies con sobrepeso tienen una función respiratoria significativamente peor. Cada kilogramo extra de grasa corporal comprime las vías respiratorias y dificulta la respiración. El control de peso es lo más impactante que puedes hacer para el manejo del BOAS.',
 55),

('respiratory_care', 'respiratory',
 'Loud snoring is common in Frenchies, but suddenly louder or more frequent snoring can signal increased airway obstruction. Baseline-check: record your dog snoring periodically and compare over months.',
 'Los ronquidos fuertes son comunes en Frenchies, pero unos ronquidos de repente más fuertes o frecuentes pueden señalar una mayor obstrucción de las vías respiratorias. Control de base: graba a tu perro roncando periódicamente y compara a lo largo de los meses.',
 56),

('respiratory_care', 'respiratory',
 'High humidity makes it harder for Frenchies to cool down even at lower temperatures. A 30°C day with 80% humidity is more dangerous for your Frenchie than a 34°C day with 20% humidity.',
 'La alta humedad dificulta que los Frenchies se enfríen incluso a temperaturas más bajas. Un día de 30°C con 80% de humedad es más peligroso para tu Frenchie que un día de 34°C con 20% de humedad.',
 57),

('respiratory_care', 'respiratory',
 'Always carry water and a collapsible bowl on walks. Offer water every 10–15 minutes during activity. Dehydration worsens mucus viscosity in the airways and can rapidly escalate a mild episode.',
 'Siempre lleva agua y un tazón plegable en las caminatas. Ofrece agua cada 10–15 minutos durante la actividad. La deshidratación empeora la viscosidad del moco en las vías respiratorias y puede escalar rápidamente un episodio leve.',
 58),

('respiratory_care', 'respiratory',
 'Flat-faced dogs should never travel in cargo holds of aircraft. The temperature variability, stress, and limited oxygen circulation make it life-threatening. Cabin travel (small enough to fit under seat) or ground transport only.',
 'Los perros de cara plana nunca deben viajar en las bodegas de aviones. La variabilidad de temperatura, el estrés y la circulación limitada de oxígeno lo hacen potencialmente fatal. Solo viaje en cabina (si cabe bajo el asiento) o transporte terrestre.',
 59),

('respiratory_care', 'respiratory',
 'BOAS surgery (soft palate resection + nostril widening) is not just cosmetic — it significantly improves quality of life and longevity. If your vet flags moderate-to-severe BOAS, consider a consultation with a veterinary surgeon. Earlier is better.',
 'La cirugía BOAS (resección de paladar blando + ampliación de fosas nasales) no es solo estética — mejora significativamente la calidad de vida y la longevidad. Si tu veterinario detecta BOAS moderado a grave, considera una consulta con un cirujano veterinario. Cuanto antes, mejor.',
 60),

('respiratory_care', 'respiratory',
 'Cool your Frenchie during a heat stress episode: move indoors to AC, wet paws and belly with room-temperature water (NOT cold — rapid temp change can cause shock), and offer small amounts of water to drink. Do not cover with wet towels.',
 'Enfría a tu Frenchie durante un episodio de estrés por calor: llévalo a un lugar con aire acondicionado, moja las patas y el vientre con agua a temperatura ambiente (NO fría — el cambio brusco de temperatura puede causar shock) y ofrece pequeñas cantidades de agua. No lo cubras con toallas húmedas.',
 61),

('respiratory_care', 'respiratory',
 'Reverse sneezing (a rapid, honking inhalation) is common and usually harmless in Frenchies. It is triggered by irritants, excitement, or eating too fast. Gently cover both nostrils for 1–2 seconds to make the dog swallow and reset — usually resolves immediately.',
 'El estornudo inverso (una inhalación rápida y ruidosa) es común y generalmente inofensivo en Frenchies. Lo desencadenan irritantes, la emoción o comer demasiado rápido. Cubre suavemente ambas fosas nasales por 1–2 segundos para que el perro trague y se reinicie — generalmente se resuelve de inmediato.',
 62),

('respiratory_care', 'respiratory',
 'Harnesses distribute pressure across the chest, not the throat. NEVER use a neck collar as the primary restraint on a Frenchie — even mild pulling creates tracheal pressure that can worsen existing airway issues.',
 'Los arneses distribuyen la presión en el pecho, no en la garganta. NUNCA uses un collar de cuello como sujeción principal en un Frenchie — incluso tirar suavemente crea presión traqueal que puede empeorar los problemas de vías respiratorias existentes.',
 63),

('respiratory_care', 'respiratory',
 'Track respiratory episodes in the app by logging: time of day, duration, apparent trigger (heat, food, excitement, unknown), and severity. Even two or three episodes a month warrants a vet discussion — your log is the evidence they need.',
 'Registra los episodios respiratorios en la app anotando: hora del día, duración, desencadenante aparente (calor, comida, emoción, desconocido) y gravedad. Incluso dos o tres episodios al mes merece una conversación con el veterinario — tu registro es la evidencia que necesitan.',
 64),

('respiratory_care', 'respiratory',
 'Annual respiratory check-up: ask your vet to evaluate nostril width and listen to your Frenchie''s airway every year. BOAS severity can worsen with age and weight gain — catching it early means simpler interventions.',
 'Revisión respiratoria anual: pide a tu veterinario que evalúe el ancho de las fosas nasales y escuche las vías respiratorias de tu Frenchie cada año. La gravedad del BOAS puede empeorar con la edad y el aumento de peso — detectarlo a tiempo significa intervenciones más sencillas.',
 65),

-- ── EAR & EYE CARE (15 tips) ─────────────────────────────────────────────
('ear_eye_care', 'ear_eye',
 'French Bulldogs have prominent, shallow eye sockets — their eyes are more exposed than most breeds and therefore more vulnerable to dust, debris, wind, and accidental scratches. Inspect eyes daily during grooming.',
 'Los Bulldogs Franceses tienen cuencas oculares prominentes y poco profundas — sus ojos están más expuestos que la mayoría de las razas y por ello son más vulnerables al polvo, suciedad, viento y rasguños accidentales. Inspecciona los ojos diariamente durante el aseo.',
 66),

('ear_eye_care', 'ear_eye',
 'Normal eye discharge in Frenchies is a small amount of clear or slightly white crust in the inner corner. Abnormal discharge: yellow or green (bacterial infection), excessive brown staining, or mucus that doesn''t clear with gentle wiping.',
 'La secreción ocular normal en Frenchies es una pequeña cantidad de costra clara o ligeramente blanca en el ángulo interno. Secreción anormal: amarilla o verde (infección bacteriana), manchas marrones excesivas, o mucosidad que no se limpia con un suave toque.',
 67),

('ear_eye_care', 'ear_eye',
 'Cherry eye (prolapsed third eyelid gland) appears as a red, round mass in the inner corner of one or both eyes. It is not painful initially but worsens without treatment. See a vet within a week of first noticing it — early surgical repair has a much higher success rate.',
 'El cherry eye (prolapso de la glándula del tercer párpado) aparece como una masa roja y redonda en el ángulo interno de uno o ambos ojos. No es doloroso inicialmente pero empeora sin tratamiento. Consulta al veterinario dentro de una semana de notarlo por primera vez — la reparación quirúrgica temprana tiene una tasa de éxito mucho mayor.',
 68),

('ear_eye_care', 'ear_eye',
 'Wipe eye discharge gently with a damp cotton pad, always wiping FROM the inner corner outward. Never use the same cotton for both eyes — if one eye has an infection, you risk spreading it to the other.',
 'Limpia la secreción ocular suavemente con un algodón húmedo, siempre limpiando DESDE el ángulo interno hacia afuera. Nunca uses el mismo algodón para ambos ojos — si uno tiene una infección, corres el riesgo de propagarla al otro.',
 69),

('ear_eye_care', 'ear_eye',
 'Corneal ulcers are painful and potentially blinding — Frenchies are at high risk due to their shallow eye sockets. Signs: squinting, pawing at the eye, cloudiness, or redness. This is a same-day vet visit, not a "watch and wait" situation.',
 'Las úlceras corneales son dolorosas y potencialmente cegadoras — los Frenchies tienen alto riesgo debido a sus cuencas oculares poco profundas. Señales: parpadeo excesivo, rascarse el ojo, opacidad o enrojecimiento. Esto requiere visita al veterinario el mismo día, no una situación de "esperar y ver".',
 70),

('ear_eye_care', 'ear_eye',
 'The skin fold over the nose (nose rope) can rub directly against the eyes and cause chronic corneal irritation. Keep this fold clean and dry, and ask your vet if its depth is impacting eye health.',
 'El pliegue de piel sobre la nariz (nose rope) puede rozar directamente los ojos y causar irritación corneal crónica. Mantén este pliegue limpio y seco, y pregunta a tu veterinario si su profundidad está afectando la salud ocular.',
 71),

('ear_eye_care', 'ear_eye',
 'Frenchie ears should be inspected weekly. Healthy ears are light pink inside, odor-free, and have minimal light-colored wax. Red, dark brown discharge, strong odor, or your dog shaking its head or pawing at its ears are all signs of infection.',
 'Las orejas de los Frenchies deben inspeccionarse semanalmente. Las orejas sanas son de color rosa claro por dentro, sin olor y con mínima cera de color claro. El color rojo, la secreción marrón oscura, el olor fuerte o que tu perro sacuda la cabeza o se rasque las orejas son señales de infección.',
 72),

('ear_eye_care', 'ear_eye',
 'When cleaning ears, use a vet-approved ear cleanser — pour a small amount into the canal, massage gently at the base for 30 seconds, then let the dog shake its head. Wipe only the visible part of the canal with a cotton ball. Never use cotton swabs inside the canal.',
 'Al limpiar las orejas, usa un limpiador auditivo aprobado por el veterinario — vierte una pequeña cantidad en el canal, masajea suavemente en la base durante 30 segundos y deja que el perro sacuda la cabeza. Limpia solo la parte visible del canal con un algodón. Nunca uses hisopos dentro del canal.',
 73),

('ear_eye_care', 'ear_eye',
 'Yeast ear infections smell like corn chips, sourdough, or a musty sweet odor. Bacterial infections tend to smell more foul and produce darker discharge. Your vet needs a cytology swab to confirm which — don''t self-medicate without knowing the cause.',
 'Las infecciones de oído por hongos huelen a palomitas de maíz, masa madre o un olor dulce y mohoso. Las infecciones bacterianas tienden a oler peor y producen secreciones más oscuras. Tu veterinario necesita un hisopado citológico para confirmar cuál es — no te automediques sin conocer la causa.',
 74),

('ear_eye_care', 'ear_eye',
 'Food allergies are among the most common causes of recurring ear infections in Frenchies. If your dog gets otitis more than twice a year, ask your vet about a protein elimination trial — the ear and the gut are more connected than they seem.',
 'Las alergias alimentarias son una de las causas más comunes de infecciones de oído recurrentes en Frenchies. Si tu perro padece otitis más de dos veces al año, pregunta a tu veterinario sobre una prueba de eliminación de proteínas — el oído y el intestino están más conectados de lo que parecen.',
 75),

('ear_eye_care', 'ear_eye',
 'Ear mites (Otodectes) cause intense itching and produce a dark, coffee-ground-like discharge. They are contagious to other pets in the household. Treatment is quick once diagnosed — but requires veterinary confirmation to distinguish from yeast infections.',
 'Los ácaros del oído (Otodectes) causan picazón intensa y producen una secreción oscura similar a los posos de café. Son contagiosos para otras mascotas del hogar. El tratamiento es rápido una vez diagnosticado — pero requiere confirmación veterinaria para distinguirlos de las infecciones por hongos.',
 76),

('ear_eye_care', 'ear_eye',
 'After swimming or bathing, gently dry the inside of your Frenchie''s ears with a cotton ball. Residual moisture is the #1 preventable cause of ear infections in dogs.',
 'Después de nadar o bañarse, seca suavemente el interior de las orejas de tu Frenchie con un algodón. La humedad residual es la causa #1 prevenible de infecciones de oído en perros.',
 77),

('ear_eye_care', 'ear_eye',
 'Entropion (eyelid rolling inward) causes eyelashes to constantly scratch the cornea. Signs: excessive tearing, squinting, or brown tear staining that doesn''t clear up. Common in the breed — ask your vet about it at the first annual checkup.',
 'El entropión (párpado enrollado hacia adentro) hace que las pestañas rasquen constantemente la córnea. Señales: lagrimeo excesivo, parpadeo excesivo o manchas de lágrimas marrones que no desaparecen. Común en la raza — pregunta a tu veterinario al respecto en el primer chequeo anual.',
 78),

('ear_eye_care', 'ear_eye',
 'Protect your Frenchie''s eyes on windy days or during car rides with windows open. Dust and debris can cause traumatic corneal scratches. Dog goggles ("Doggles") are not just a fashion statement — they are legitimate protection for brachycephalic breeds.',
 'Protege los ojos de tu Frenchie en días ventosos o durante viajes en coche con ventanas abiertas. El polvo y los escombros pueden causar rasguños traumáticos en la córnea. Las gafas para perros ("Doggles") no son solo una moda — son una protección legítima para las razas braquicéfalas.',
 79),

('ear_eye_care', 'ear_eye',
 'Log ear and eye observations weekly in the app. A pattern of recurring infections in the same ear, or increasing eye discharge, gives your vet the timeline context to prescribe targeted treatment — instead of treating blind.',
 'Registra las observaciones de oídos y ojos semanalmente en la app. Un patrón de infecciones recurrentes en el mismo oído, o secreción ocular en aumento, le da a tu veterinario el contexto temporal para prescribir un tratamiento específico — en lugar de tratar a ciegas.',
 80),

-- ── JOINTS (15 tips) ──────────────────────────────────────────────────────
('joint_care', 'joints',
 'Intervertebral Disc Disease (IVDD) is the most serious orthopedic risk in French Bulldogs — their compact spine and abnormal disc architecture make them highly susceptible. Signs: reluctance to jump, yelping when touched, abnormal posture, or any sudden hind-limb weakness. Immediate vet care.',
 'La Enfermedad de Disco Intervertebral (IVDD) es el riesgo ortopédico más grave en los Bulldogs Franceses — su columna compacta y la arquitectura anormal de los discos los hacen muy susceptibles. Señales: renuencia a saltar, quejidos al ser tocado, postura anormal o cualquier debilidad súbita de los miembros posteriores. Atención veterinaria inmediata.',
 81),

('joint_care', 'joints',
 'Jumping off furniture — even a standard sofa — generates 3–5x body weight force on a Frenchie''s spine and joints upon landing. Use ramps or pet steps to eliminate jumps from sofas, beds, and cars.',
 'Saltar de los muebles — incluso de un sofá estándar — genera una fuerza de 3 a 5 veces el peso corporal en la columna y articulaciones de un Frenchie al aterrizar. Usa rampas o escalones para mascotas para eliminar los saltos de sofás, camas y coches.',
 82),

('joint_care', 'joints',
 'Hip dysplasia affects 20–40% of French Bulldogs. Early signs: bunny-hopping gait when running, difficulty rising from a lying position, reluctance to exercise, or a "clicking" sound from the hips. Annual hip assessment from age 2 is recommended.',
 'La displasia de cadera afecta al 20–40% de los Bulldogs Franceses. Signos tempranos: trote "de conejo" al correr, dificultad para levantarse de la posición acostada, renuencia a ejercitarse o un sonido "clic" de las caderas. Se recomienda evaluación anual de caderas desde los 2 años.',
 83),

('joint_care', 'joints',
 'Swimming is the ideal exercise for Frenchies with joint issues — it builds muscle that protects joints without loading them. Hydrotherapy (underwater treadmill) is available at many veterinary rehabilitation centers and is worth exploring for dogs with confirmed dysplasia or IVDD.',
 'La natación es el ejercicio ideal para Frenchies con problemas articulares — desarrolla músculos que protegen las articulaciones sin cargarlas. La hidroterapia (cinta de correr subacuática) está disponible en muchos centros de rehabilitación veterinaria y vale la pena explorarla para perros con displasia confirmada o IVDD.',
 84),

('joint_care', 'joints',
 'Orthopedic memory foam beds reduce joint pressure during sleep. Frenchies sleep 12–14 hours a day — what they sleep on matters as much as what they do while awake. Look for beds with at least 3 inches of memory foam and waterproof covers.',
 'Las camas de espuma de memoria ortopédica reducen la presión articular durante el sueño. Los Frenchies duermen 12–14 horas al día — en qué duermen importa tanto como lo que hacen mientras están despiertos. Busca camas con al menos 7,5 cm de espuma de memoria y cubiertas impermeables.',
 85),

('joint_care', 'joints',
 'Short, frequent walks are better for Frenchie joints than long, infrequent ones. Three 10-minute walks distributes joint loading throughout the day and avoids the fatigue that causes compensatory postures and muscle injury.',
 'Las caminatas cortas y frecuentes son mejores para las articulaciones de los Frenchies que las largas e infrecuentes. Tres caminatas de 10 minutos distribuyen la carga articular a lo largo del día y evitan la fatiga que causa posturas compensatorias y lesiones musculares.',
 86),

('joint_care', 'joints',
 'Glucosamine and chondroitin supplements are commonly used for joint health in dogs and have a good safety profile. However, quality and dosing vary enormously between products — ask your vet for a brand and dose appropriate for your Frenchie''s weight and age.',
 'Los suplementos de glucosamina y condroitina se usan comúnmente para la salud articular en perros y tienen un buen perfil de seguridad. Sin embargo, la calidad y dosificación varían enormemente entre productos — pide a tu veterinario una marca y dosis apropiada para el peso y la edad de tu Frenchie.',
 87),

('joint_care', 'joints',
 'Cold and damp weather stiffens joints. On cold mornings (below 10°C / 50°F), give your Frenchie 5 minutes of gentle indoor movement before going outside — a quick walk around the house to warm up muscles reduces injury risk.',
 'El frío y la humedad endurecen las articulaciones. En las mañanas frías (por debajo de 10°C), dale a tu Frenchie 5 minutos de movimiento suave en interiores antes de salir — una pequeña caminata por la casa para calentar los músculos reduce el riesgo de lesiones.',
 88),

('joint_care', 'joints',
 'Slippery floors are a significant injury risk for Frenchies with joint issues. Add non-slip rugs or yoga mat runners on hardwood and tile floors in main traffic areas. This is especially important near food and water bowls where they lean repeatedly.',
 'Los suelos resbaladizos son un riesgo significativo de lesión para los Frenchies con problemas articulares. Añade alfombras antideslizantes o corredores de esterilla de yoga en suelos de madera y baldosas en las zonas de mayor tráfico. Esto es especialmente importante cerca de los comederos y bebederos.',
 89),

('joint_care', 'joints',
 'Obesity is the most preventable cause of early joint degeneration in French Bulldogs. Every 1 kg of excess weight adds 3–4 kg of force on the joints with every step. Weight reduction is the single most impactful orthopedic intervention — even before supplements.',
 'La obesidad es la causa más prevenible de degeneración articular temprana en Bulldogs Franceses. Cada kilogramo de exceso de peso añade 3–4 kg de fuerza en las articulaciones con cada paso. La pérdida de peso es la intervención ortopédica más impactante — incluso antes que los suplementos.',
 90),

('joint_care', 'joints',
 'If your Frenchie starts limping suddenly after play or exercise, rest them for 24 hours and monitor. Limping that persists beyond 24 hours, that recurs, or that is accompanied by swelling, crying, or inability to bear weight needs same-day veterinary evaluation.',
 'Si tu Frenchie empieza a cojear de repente después de jugar o hacer ejercicio, dale descanso durante 24 horas y monitorea. La cojera que persiste más de 24 horas, que se repite o que va acompañada de inflamación, llantos o incapacidad para apoyar el peso necesita evaluación veterinaria el mismo día.',
 91),

('joint_care', 'joints',
 'Stairs are harder on a Frenchie''s spine than on most dogs due to their long back and short legs. If you have stairs in your home, limit unsupervised access. Many IVDD cases in Frenchies are triggered by going up or down stairs quickly.',
 'Las escaleras son más duras para la columna de un Frenchie que para la mayoría de los perros debido a su espalda larga y sus patas cortas. Si tienes escaleras en casa, limita el acceso sin supervisión. Muchos casos de IVDD en Frenchies se desencadenan al subir o bajar escaleras rápidamente.',
 92),

('joint_care', 'joints',
 'Neurological signs — dragging hind legs, loss of bladder or bowel control, stumbling, or sudden inability to walk — are spinal emergencies. Do not wait. Transport the dog as flat as possible and go to an emergency vet immediately. Hours matter for IVDD outcomes.',
 'Los signos neurológicos — arrastrar las patas traseras, pérdida del control de vejiga o intestino, tropiezos o incapacidad repentina para caminar — son emergencias espinales. No esperes. Transporta al perro lo más plano posible y ve a un veterinario de urgencias de inmediato. Las horas importan para los resultados del IVDD.',
 93),

('joint_care', 'joints',
 'Log your Frenchie''s limping episodes in the app with the affected limb, duration, and what activity preceded it. Orthopedic issues often appear intermittent before becoming chronic — your log will help the vet see the full picture.',
 'Registra los episodios de cojera de tu Frenchie en la app con la extremidad afectada, la duración y la actividad previa. Los problemas ortopédicos a menudo parecen intermitentes antes de volverse crónicos — tu registro ayudará al veterinario a ver el panorama completo.',
 94),

('joint_care', 'joints',
 'Puppies (under 12 months) should avoid intense, repetitive exercise like fetch on hard surfaces or repeated stair climbing. Growth plates close around 10–12 months — high-impact activity before closure increases the risk of permanent joint damage.',
 'Los cachorros (menores de 12 meses) deben evitar ejercicios intensos y repetitivos como buscar objetos en superficies duras o subir escaleras repetidamente. Las placas de crecimiento se cierran alrededor de los 10–12 meses — la actividad de alto impacto antes del cierre aumenta el riesgo de daño articular permanente.',
 95),

-- ── WEIGHT & DIGESTION (15 tips) ──────────────────────────────────────────
('weight_digestion', 'weight',
 'An ideal adult French Bulldog weighs 8–14 kg. Use the Body Condition Score (BCS): looking from above, you should see a slight waist indentation behind the ribs; feeling the ribs, you should feel them easily without pressing hard. Both too prominent and invisible ribs signal a problem.',
 'Un Bulldog Francés adulto ideal pesa 8–14 kg. Usa el Índice de Condición Corporal (ICC): mirando desde arriba, debes ver una ligera indentación en la cintura detrás de las costillas; al palpar las costillas, deberías sentirlas fácilmente sin presionar fuerte. Costillas demasiado prominentes o invisibles señalan un problema.',
 96),

('weight_digestion', 'weight',
 'Frenchies are extremely gas-prone due to their anatomy. They gulp air when eating, which leads to flatulence. Slow-feeder bowls or puzzle feeders reduce air ingestion at mealtimes by up to 70% — a simple change with a significant impact.',
 'Los Frenchies son extremadamente propensos a los gases debido a su anatomía. Tragan aire al comer, lo que produce flatulencias. Los comederos lentos o de puzzles reducen la ingesta de aire en las comidas hasta un 70% — un cambio sencillo con un impacto significativo.',
 97),

('weight_digestion', 'weight',
 'Monitor stool consistency daily (it takes 30 seconds). The ideal stool is firm, log-shaped, and easy to pick up. Loose stools 3+ days in a row, mucus, blood, or undigested food warrant a vet call.',
 'Monitorea la consistencia de las heces diariamente (tarda 30 segundos). Las heces ideales son firmes, con forma de cilindro y fáciles de recoger. Heces blandas durante 3 o más días consecutivos, moco, sangre o comida sin digerir justifican una llamada al veterinario.',
 98),

('weight_digestion', 'weight',
 'Feed your Frenchie from a raised bowl (5–10 cm off the ground) to reduce the angle of swallowing and decrease air ingestion. Do NOT use this for dogs with suspected Megaesophagus — ask your vet first.',
 'Alimenta a tu Frenchie con un tazón elevado (5–10 cm del suelo) para reducir el ángulo de deglución y disminuir la ingesta de aire. NO uses esto para perros con sospecha de megaesófago — consulta a tu veterinario primero.',
 99),

('weight_digestion', 'weight',
 'A sudden loss of appetite (more than 24 hours without eating voluntarily) in a Frenchie that normally has a good appetite is a warning sign. Combined with lethargy, vomiting, or a bloated belly, it could indicate a serious GI issue — call your vet.',
 'Una pérdida repentina del apetito (más de 24 horas sin comer voluntariamente) en un Frenchie que normalmente come bien es una señal de advertencia. Combinada con letargo, vómitos o vientre hinchado, podría indicar un problema gastrointestinal grave — llama a tu veterinario.',
 100),

('weight_digestion', 'weight',
 'Weigh your Frenchie monthly at home using a bathroom scale: weigh yourself, then weigh yourself holding the dog, and subtract. A change of more than 500g in a month without a dietary change warrants investigation.',
 'Pesa a tu Frenchie mensualmente en casa usando una báscula de baño: pésate a ti mismo, luego pésate sosteniendo al perro y resta. Un cambio de más de 500g en un mes sin cambio dietético justifica una investigación.',
 101),

('weight_digestion', 'weight',
 'Abdominal bloating (GDV/torsion) is rare in Frenchies compared to large breeds but can occur. Signs: distended, hard belly, unproductive retching, excessive drooling, restlessness. This is a life-threatening emergency requiring immediate surgery.',
 'La torsión gástrica (GDV) es rara en los Frenchies en comparación con las razas grandes, pero puede ocurrir. Señales: abdomen distendido y duro, arcadas improductivas, babeo excesivo, inquietud. Es una emergencia potencialmente mortal que requiere cirugía inmediata.',
 102),

('weight_digestion', 'weight',
 'When transitioning foods, do it over 7–10 days: 25% new / 75% old for 3 days, then 50/50 for 3 days, then 75% new / 25% old for 3 days, then 100% new. Rapid transitions are the #1 cause of digestive upset in dogs.',
 'Al cambiar de alimento, hazlo en 7–10 días: 25% nuevo / 75% viejo durante 3 días, luego 50/50 durante 3 días, luego 75% nuevo / 25% viejo durante 3 días y finalmente 100% nuevo. Los cambios rápidos son la causa #1 de malestar digestivo en los perros.',
 103),

('weight_digestion', 'weight',
 'Vomiting once after a new food or eating too fast is usually not serious. Vomiting 3+ times in 24 hours, vomiting blood, or persistent vomiting over 2+ days = vet visit. Never "wait and see" on blood in vomit.',
 'Vomitar una vez después de un alimento nuevo o comer demasiado rápido generalmente no es grave. Vomitar 3 o más veces en 24 horas, vomitar sangre o vómitos persistentes durante 2 o más días = visita al veterinario. Nunca "esperar y ver" si hay sangre en el vómito.',
 104),

('weight_digestion', 'weight',
 'Constipation in Frenchies can result from dehydration, low-fiber diet, or ingested hair/foreign material. Signs: straining without producing stool, dry hard stools, or going more than 48 hours without a bowel movement. A vet call is warranted after 48 hours.',
 'El estreñimiento en Frenchies puede resultar de deshidratación, dieta baja en fibra o pelo/material extraño ingerido. Señales: esfuerzo sin producir heces, heces duras y secas, o más de 48 horas sin evacuación. Una llamada al veterinario está justificada después de 48 horas.',
 105),

('weight_digestion', 'weight',
 'Treats should represent no more than 10% of daily calories. For a 10 kg Frenchie eating 400 kcal/day, that''s only 40 kcal from treats — roughly 3–4 small commercial treats. Many owners unknowingly double their dog''s caloric intake through treats.',
 'Las golosinas no deben representar más del 10% de las calorías diarias. Para un Frenchie de 10 kg que come 400 kcal/día, eso es solo 40 kcal de golosinas — aproximadamente 3–4 pequeñas golosinas comerciales. Muchos dueños duplican inadvertidamente la ingesta calórica de su perro a través de las golosinas.',
 106),

('weight_digestion', 'weight',
 'Pancreatitis (inflamed pancreas) can be triggered by a single high-fat meal — a piece of bacon, butter, or fatty table scraps. Signs: hunched posture, vomiting, diarrhea, and severe abdominal pain. Requires hospitalization. Completely avoid high-fat human foods.',
 'La pancreatitis (páncreas inflamado) puede desencadenarse con una sola comida alta en grasa — un trozo de tocino, mantequilla o restos grasos de la mesa. Señales: postura encorvada, vómitos, diarrea y dolor abdominal severo. Requiere hospitalización. Evita completamente los alimentos humanos con alto contenido en grasa.',
 107),

('weight_digestion', 'weight',
 'Track your Frenchie''s weight in the app monthly. A downward trend without dietary restriction can indicate thyroid issues, parasites, or other systemic illness. An upward trend is easier to reverse early — waiting 6 months to act is the most common mistake.',
 'Registra el peso de tu Frenchie en la app mensualmente. Una tendencia a la baja sin restricción dietética puede indicar problemas de tiroides, parásitos u otra enfermedad sistémica. Una tendencia al alza es más fácil de revertir a tiempo — esperar 6 meses para actuar es el error más común.',
 108),

('weight_digestion', 'weight',
 'Coprophagia (eating feces) is disturbingly common in Frenchies. It is often a behavioral issue but can also signal nutritional deficiency or malabsorption. Keep the yard clean, feed a complete and balanced diet, and mention it to your vet if it persists.',
 'La coprofagia (comer heces) es inquietantemente común en los Frenchies. A menudo es un problema de comportamiento, pero también puede señalar deficiencia nutricional o malabsorción. Mantén el jardín limpio, alimenta con una dieta completa y equilibrada y menciónaselo a tu veterinario si persiste.',
 109),

('weight_digestion', 'weight',
 'Intestinal parasites (roundworms, hookworms, giardia) are a common hidden cause of chronic loose stools, poor coat, and failure to gain weight in young dogs. Annual fecal tests are the only way to confirm and treat them — prevention with regular deworming is key.',
 'Los parásitos intestinales (toxocara, anquilostomas, giardia) son una causa oculta común de heces blandas crónicas, pelaje pobre y falta de aumento de peso en perros jóvenes. Las pruebas coprológicas anuales son la única forma de confirmarlos y tratarlos — la prevención con desparasitación regular es clave.',
 110),

-- ── GENERAL HEALTH CALENDAR (15 tips) ────────────────────────────────────
('health_calendar', 'health',
 'Core vaccines for French Bulldogs: DA2PP (distemper, adenovirus, parvovirus, parainfluenza) annually or every 3 years after initial series, plus Rabies as required by local law. Keep a vaccine record in the app — you''ll thank yourself at every vet visit.',
 'Vacunas esenciales para Bulldogs Franceses: DA2PP (moquillo, adenovirus, parvovirus, parainfluenza) anual o cada 3 años tras la serie inicial, más Rabia según lo exija la ley local. Guarda el registro de vacunas en la app — lo agradecerás en cada visita al veterinario.',
 111),

('health_calendar', 'health',
 'Leptospirosis and Bordetella vaccines are recommended in urban or multi-dog environments (dog parks, groomers, boarding). They are "lifestyle vaccines" — discuss with your vet based on where and how your Frenchie socializes.',
 'Las vacunas contra la leptospirosis y la bordetella se recomiendan en entornos urbanos o con múltiples perros (parques caninos, peluquerías, residencias). Son "vacunas de estilo de vida" — discute con tu veterinario según dónde y cómo socializa tu Frenchie.',
 112),

('health_calendar', 'health',
 'Deworming schedule: puppies every 2 weeks until 12 weeks, monthly until 6 months, then every 3–6 months based on lifestyle and risk (outdoor time, contact with other animals). Many vets recommend year-round heartworm prevention in at-risk climates.',
 'Calendario de desparasitación: cachorros cada 2 semanas hasta las 12 semanas, mensual hasta los 6 meses, luego cada 3–6 meses según el estilo de vida y el riesgo (tiempo al aire libre, contacto con otros animales). Muchos veterinarios recomiendan la prevención anual de la dirofilaria en climas de riesgo.',
 113),

('health_calendar', 'health',
 'Flea and tick prevention: monthly topical or oral preventives are standard. Start before flea season in your region. Fleas can trigger skin allergies in Frenchies — a single flea bite can cause a "flea allergy dermatitis" flare that lasts weeks.',
 'Prevención de pulgas y garrapatas: los preventivos tópicos u orales mensuales son estándar. Comienza antes de la temporada de pulgas en tu región. Las pulgas pueden desencadenar alergias de piel en Frenchies — una sola picadura puede causar un brote de "dermatitis alérgica a las pulgas" que dura semanas.',
 114),

('health_calendar', 'health',
 'Annual vet wellness exams are not optional — they are the single most cost-effective investment in your Frenchie''s health. Many serious conditions (dental disease, thyroid issues, heart murmurs, early tumors) are caught during routine physical exams long before symptoms appear.',
 'Los exámenes de salud veterinarios anuales no son opcionales — son la inversión más rentable en la salud de tu Frenchie. Muchas condiciones graves (enfermedad dental, problemas de tiroides, soplos cardíacos, tumores tempranos) se detectan durante los exámenes físicos de rutina mucho antes de que aparezcan los síntomas.',
 115),

('health_calendar', 'health',
 'French Bulldogs should have a dental cleaning under anesthesia at least once every 1–2 years. 80% of dogs have significant dental disease by age 3. Untreated dental disease causes pain, tooth loss, and bacterial spread to kidneys, heart, and liver.',
 'Los Bulldogs Franceses deben tener una limpieza dental bajo anestesia al menos una vez cada 1–2 años. El 80% de los perros tienen enfermedad dental significativa para los 3 años. La enfermedad dental no tratada causa dolor, pérdida de dientes y propagación bacteriana a riñones, corazón e hígado.',
 116),

('health_calendar', 'health',
 'Brush your Frenchie''s teeth 3–7 times a week with dog toothpaste (NEVER human toothpaste — xylitol is toxic to dogs). This is the most effective at-home prevention for dental disease. Start slowly: just the paste on your finger, then a brush over weeks.',
 'Cepilla los dientes de tu Frenchie 3–7 veces a la semana con pasta dental para perros (NUNCA pasta humana — el xilitol es tóxico para los perros). Esto es la prevención doméstica más eficaz para la enfermedad dental. Empieza despacio: solo la pasta en tu dedo, luego un cepillo a lo largo de semanas.',
 117),

('health_calendar', 'health',
 'Nail trimming every 3–4 weeks prevents overgrown nails that change your Frenchie''s gait and increase joint strain. If you can hear your dog''s nails clicking on the floor, they''re too long. Black nails are harder — grind rather than clip, or have your groomer do it.',
 'El corte de uñas cada 3–4 semanas evita uñas demasiado largas que cambian la marcha de tu Frenchie y aumentan la tensión articular. Si puedes escuchar el clic de las uñas de tu perro en el suelo, están demasiado largas. Las uñas negras son más difíciles — lima en lugar de cortar, o que lo haga tu peluquero canino.',
 118),

('health_calendar', 'health',
 'Spay/neuter timing is breed-specific. For French Bulldogs, many vets recommend waiting until 12–18 months for females and 12 months for males to allow full hormonal development before altering. Early spay/neuter is linked to higher rates of joint disease and some cancers in certain breeds.',
 'El momento de la esterilización/castración es específico de la raza. Para los Bulldogs Franceses, muchos veterinarios recomiendan esperar hasta los 12–18 meses en hembras y 12 meses en machos para permitir el desarrollo hormonal completo antes de la intervención. La esterilización/castración temprana está relacionada con mayores tasas de enfermedad articular y algunos cánceres en ciertas razas.',
 119),

('health_calendar', 'health',
 'Senior Frenchies (7+ years) should move to biannual vet visits and include bloodwork twice yearly. Age-related issues like hypothyroidism, kidney disease, and heart changes are common and manageable when caught early.',
 'Los Frenchies senior (7+ años) deben pasar a visitas veterinarias semestrales e incluir análisis de sangre dos veces al año. Los problemas relacionados con la edad como el hipotiroidismo, la enfermedad renal y los cambios cardíacos son comunes y manejables cuando se detectan a tiempo.',
 120),

('health_calendar', 'health',
 'Microchipping is a one-time procedure that permanently identifies your dog. ISO standard chip (15-digit) is recognized internationally. Register the chip number with a national database AND keep your contact info updated — a chip is useless if the number leads to an old address.',
 'El microchip es un procedimiento único que identifica permanentemente a tu perro. El chip estándar ISO (15 dígitos) es reconocido internacionalmente. Registra el número del chip en una base de datos nacional Y mantén actualizada tu información de contacto — un chip es inútil si el número lleva a una dirección antigua.',
 121),

('health_calendar', 'health',
 'Keep a paper and digital copy of your Frenchie''s health records: vaccines, surgeries, medications, allergies, and blood test history. In an emergency, this information can be life-saving — and vets treat dogs with known histories better than unknowns.',
 'Guarda una copia en papel y digital de los registros de salud de tu Frenchie: vacunas, cirugías, medicamentos, alergias e historial de análisis de sangre. En una emergencia, esta información puede ser crucial — y los veterinarios tratan mejor a los perros con historiales conocidos.',
 122),

('health_calendar', 'health',
 'Pet health insurance is most useful when purchased for puppies before any conditions develop — pre-existing conditions are excluded in virtually all policies. Run the numbers: the average Frenchie owner spends $1,200–$2,500 per year on vet care. Insurance averaging $60–$120/month can break even in one surgery.',
 'El seguro de salud para mascotas es más útil cuando se contrata para cachorros antes de que se desarrolle cualquier condición — las condiciones preexistentes están excluidas en prácticamente todas las pólizas. Haz los cálculos: el dueño promedio de un Frenchie gasta $1.200–$2.500 al año en cuidado veterinario. Un seguro de $60–$120/mes puede amortizarse en una sola cirugía.',
 123),

('health_calendar', 'health',
 'Know your nearest 24-hour emergency veterinary clinic before you need it. Save the address and phone number now. In a true emergency — suspected poisoning, trauma, collapse, IVDD crisis — every minute matters and you don''t want to be searching while your dog is in crisis.',
 'Conoce la clínica veterinaria de urgencias 24 horas más cercana antes de necesitarla. Guarda la dirección y el número de teléfono ahora. En una verdadera emergencia — sospecha de envenenamiento, trauma, colapso, crisis de IVDD — cada minuto importa y no querrás estar buscando mientras tu perro está en crisis.',
 124),

('health_calendar', 'health',
 'Log every health event in the app: vet visits, vaccine dates, deworming, flea treatment, dental cleanings, and surgeries. Your dog''s health calendar is only as useful as the entries in it. Set a reminder for next due dates — the app will help you stay ahead.',
 'Registra cada evento de salud en la app: visitas al veterinario, fechas de vacunas, desparasitaciones, tratamientos antipulgas, limpiezas dentales y cirugías. El calendario de salud de tu perro es tan útil como las entradas que tiene. Configura recordatorios para las próximas fechas — la app te ayudará a estar al día.',
 125);
