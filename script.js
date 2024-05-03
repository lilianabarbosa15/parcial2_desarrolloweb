const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'; //URL de la API

async function consultarApi(url){
    /*
    Función asincrona que recibe la apiUrl junto al valor que se requiere buscar
    y la clave con el fin de retornar los datos encontrados en el servidor, si
    encuentra un error muestra un mensaje en la página.
    */
    try{
        const response = await axios.get(url);
        /*Se pueden hacer validaciones para evitar errores y hacer validacion de estatus*/
        return response.data;
    }catch(error){
        console.error(`fallo en la consulta a la api: ${error}`);
        "Se muestra el error y se oculta la información"
        /*
        const contError = document.querySelector('.error');
        const contWeather = document.querySelector('.weather');
        contError.style.display = 'inline-block';
        contWeather.style.display = 'none';*/
    }
}

/*Verificación de pokemon ingresado*/
async function verifPokemon(url,input){
    /*
    Función asincrona que recibe la base de datos general y revisa si el pokemon ingresado
    se encuentra allí. Entrega true si sí, false si no
    */
    const datos = await consultarApi(url+input);
    if(datos===undefined){
        return false;
    }else{
        return true;
    }
}

async function obtenerDatos(url){
    /*
    Función asincrona que recibe una dirección y le pide los datos (ya que es un
    servidor), con el fin de modificar la apariencia de la página con la
    información encontrada.
    */
    "Se solicitan los datos al servidor"
    const datos = await consultarApi(url);
    //Nombre:
    const Nombre = datos.species.name;
    //Foto:
    let Foto = datos.sprites.front_default; //.other.official-artwork.front_default;
    console.log(Foto)
    //Tipo: 
    const Tipo = new Array();
    for(let index in datos.types){
        Tipo.push(datos.types[index].type.name);
    }
    let TipoStr = "";
    for(let t in Tipo){
        TipoStr += String(Tipo[t]);
        if(parseInt(t)+1!=Tipo.length){
            TipoStr += ", ";
        }
    }
    //Descripción:
    let Descripcion = new String;
    const datosDescripcion = await consultarApi(datos.species.url);
    let contador = 0
    for(let index in datosDescripcion.flavor_text_entries){
        if(datosDescripcion.flavor_text_entries[index].language.name==="es"){
            //console.log(datosDescripcion.flavor_text_entries[index].language);
            if(contador===0 || contador===6){
                let aux = (datosDescripcion.flavor_text_entries[index].flavor_text).replaceAll('\n', " ")
                Descripcion += aux + " ";
            }
            contador++;
        }
    }
    //Habilidades:
    const Habilidades = new Array();
    for (let index in datos.abilities){
        Habilidades.push(datos.abilities[index].ability.name);
    }
    let HabilidadesStr = "";
    for(let h in Habilidades){
        HabilidadesStr += String(Habilidades[h]);
        if(parseInt(h)+1 != Habilidades.length){
            HabilidadesStr += ", ";
        }
    }
    "Se actualiza la información"
    const newName = document.querySelector(".pokemonName");
    newName.innerHTML=Nombre;
    const newImage = document.querySelector(".pokemonImg");
    newImage.src=Foto;
    const newTipo = document.querySelector(".pokemonType");
    newTipo.innerHTML=TipoStr;
    const newDescrip = document.querySelector(".pokemonDescrition");
    newDescrip.innerHTML=Descripcion;
    const newHabilidad = document.querySelector(".pokemonAbilities");
    newHabilidad.innerHTML=HabilidadesStr;
    "Se muestra el botón evolucionar si así es el caso"
    if(evolucionarPokemon(datos.species.url, Nombre) === ""){
        console.log("no hay evolucion!")
    }
    "Se muestra la información cuando está bien todo"
    /*const contError = document.querySelector('.error');
    const contWeather = document.querySelector('.weather');
    contError.style.display = 'none';
    contWeather.style.display = 'block';*/
}

async function evolucionarPokemon(url, name){
    /*
    Función que recibe la url que contiene el resto de información
    a saberse si es candidato a evolucionar, guarda el nombre del próximo
    pokemón y muestra el botón.
    */
    nombreEvol = "";
   console.log(url);
   "Se solicitan los datos al servidor"
   const datos = await consultarApi(url);
   console.log(datos.evolution_chain.url);
   const datosEvol = await consultarApi(datos.evolution_chain.url);

   if(datosEvol.chain.species.name==name && datosEvol.chain.evolves_to.length==0){
    console.log("no evolución");
    nombreEvol = "";
   }else if(datosEvol.chain.species.name==name){
    console.log("evol: ", datosEvol.chain.evolves_to[0].species.name);
    nombreEvol = datosEvol.chain.evolves_to[0].species.name;
   } else{
    if(datosEvol.chain.evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to.length==0){
        console.log("no evolución");
        nombreEvol = "";
    }else if(datosEvol.chain.evolves_to[0].species.name==name){
        console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].species.name);
        nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].species.name;
    }else{

        if(datosEvol.chain.evolves_to[0].evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to.length==0){
            console.log("no evolución");
            nombreEvol = "";
        }else if(datosEvol.chain.evolves_to[0].evolves_to[0].species.name==name){
            console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name);
            nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name;
        }else{
            if(datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to.length==0){
                console.log("no evolución");
                nombreEvol = "";
            }else if(datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name==name){
                console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to[0].species.name);
                nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to[0].species.name;
            }
        }
    }
   }
   return nombreEvol;
}













/*Captura datos*/
const searchButton = document.querySelector('.buttonSearch');
const searchInput = document.querySelector('#in1');

searchButton.addEventListener( /*Se agrega CallBack, función que se ejecuta en el momento del evento*/
    "click", () => { /*Función anonima para obtener datos del plato*/
        //Se limpia la pantalla de algún error anterior:
        //updateWindow(true);
        //Se lee el valor ingresado por el usuario y se verifica levemente:
        let inputData = String(searchInput.value);
        if(verifPokemon(url,input)==true){
            
        }
    }
)








