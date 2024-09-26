-- Script para insertar 100.000 culturas	
INSERT INTO public.gastronomic_culture_entity(name)
SELECT
    'Cultura ' || (row_number() OVER ()) AS name
FROM generate_series(1, 100000);	
	
	
-- Script para insertar 100.000 paises	
INSERT INTO public.country_entity(name)
SELECT
    'Country ' || (row_number() OVER ()) AS name
FROM generate_series(1, 100000);	


-- Script para insertar 100.000 productos	
INSERT INTO public.characteristic_product_entity(name, description, history, category)
SELECT
    'Producto ' || (row_number() OVER ()) AS nombre,
    'Descripcion del producto ' || (row_number() OVER ()) AS description,
    'Historia del producto ' || (row_number() OVER ()) AS history,
	'Categoria del producto ' || (row_number() OVER ()) AS category
FROM generate_series(1, 100000);


-- Script para insertar 100.000 recetas	
INSERT INTO public.recipe_entity(name, description, photo, "preparationProcess", video)
SELECT
    'Receta ' || (row_number() OVER ()) AS nombre,
    'Descripcion de la receta ' || (row_number() OVER ()) AS description,
    'www.recetasdelmundo.com/fotorecetas/' || (row_number() OVER ()) AS photo,
    'Proceso de preparacion receta ' || (row_number() OVER ()) AS preparationProcess,
    'www.recetasdelmundo.com/videorecetas/' || (row_number() OVER ()) AS video
FROM generate_series(1, 100000);

-- Script para incluir 100.000 restaurantes
INSERT INTO public.restaurant_entity(name, city, "michelinStars", "awardDate")
SELECT
    'Restaurante ' || (row_number() OVER ()) AS name,
    'Ciudad ' || (row_number() OVER ()) AS city,
	3,
	NOW() - (interval '1 day' * (row_number() OVER ()))
FROM generate_series(1, 100000);

