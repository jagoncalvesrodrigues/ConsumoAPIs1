const API_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_fav = 'https://api.thecatapi.com/v1/favourites';
const API_upload = 'https://api.thecatapi.com/v1/images/upload';
const API_del = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_38U94lRi8xpHtV8pz4BRcoEOuYxGv44av8O6K5c2cdhJkhEWb5JXbsFHyB9GfUS2`;


const spanError = document.getElementById('error');

async function loadRandomCats(){
	const res = await fetch(API_RANDOM);
	const data = await res.json();

	console.log(data);
	if(res.status !== 200){
		spanError.innerHTML= "ERRORRRRRR" + res.status + data.message;
	}else{
		const img1 = document.getElementById('img1');
		const btn1 = document.getElementById('btn1');
		const img2 = document.getElementById('img2');
		const btn2 = document.getElementById('btn2');
 		img1.src = data[0].url;
 		img2.src = data[1].url;

		//metemos esta arrow function porque sin ella se invoca la funcion directamente sin hacer el click
		btn1.onclick = () => saveFavouritesGato(data[0].id);
		btn2.onclick = () => saveFavouritesGato(data[1].id);
	}
}

async function favourites(){
	const res = await fetch(API_fav, {
		method:"GET",
		headers:{
			'x-api-key':'live_38U94lRi8xpHtV8pz4BRcoEOuYxGv44av8O6K5c2cdhJkhEWb5JXbsFHyB9GfUS2',
		}
	});
	const data = await res.json();

	console.log(data);

	if(res.status !== 200){
		spanError.innerHTML= "ERRORRRRRR" + res.status + data.message;
	}else{
		const section = document.getElementById('favouritesMichis');
		section.innerHTML ="";
		const h2 = document.createElement('h2');
		const h2Text = document.createTextNode('Gatos Favoritos');
		h2.appendChild(h2Text);
		section.appendChild(h2);


		data.forEach(gato=>{
			// gato.image.url

			const article = document.createElement('article');
			const img = document.createElement('img');
			const btn = document.createElement('button');
			const btntext = document.createTextNode('Sacar al gato de Favoritos');
			const width = document.createAttribute('width');

			btn.onclick = ()=> deleteFavourites(gato.id);

			width.value="150";
			img.setAttributeNode(width);

			btn.appendChild(btntext);
			img.src=gato.image.url;
			article.appendChild(img);
			article.appendChild(btn);
			section.appendChild(article);
		})
	}
}

async function saveFavouritesGato(id) {
	const res = await fetch(API_fav, {
	 	method:'POST',
		//caracteristicas de la llamada
		headers:{
			'Content-Type':'application/json',
			'x-api-key':'live_38U94lRi8xpHtV8pz4BRcoEOuYxGv44av8O6K5c2cdhJkhEWb5JXbsFHyB9GfUS2',
		},
		//informacion que le vamos a pasar y se lo pasas como un string
		body:JSON.stringify({
			image_id:id
		}),
	 });
	 const data = await res.json();

	console.log('Save');
	console.log(res);	

	if(res.status !== 200){
		spanError.innerHTML= "ERRORRRRRR" + res.status + data.message;
	}else{
		console.log("gato guardado");
		favourites();
	}


}

async function deleteFavourites(id){
	const res = await fetch(API_del(id), {
		method:'DELETE',
	});
	const data = await res.json();

	if(res.status !== 200){
		spanError.innerHTML= "ERRORRRRRR" + res.status + data.message;
	}else{
		console.log("gato eliminado de favoritos");
		favourites();
	}

}

async function uploadGatoPhoto(){
	//aqui se utilizara form data
	const form = document.getElementById('uploadingForm');
	//aqui se agregan los datos introducidos en formdata
	const formData = new FormData(form);

	console.log('formdatata')
	console.log(formData.get('file'));

	const res = await fetch(API_upload,{
		method:"POST",
		headers:{
			// 'Content-Type':'multipart/form-data',
			'x-api-key':'live_38U94lRi8xpHtV8pz4BRcoEOuYxGv44av8O6K5c2cdhJkhEWb5JXbsFHyB9GfUS2',
		},
		//no hace falta cambiarlo a JSONstringfy
		body: formData,
	})
	const data = await res.json();

	if(res.status !== 201){
		spanError.innerHTML= "ERRORRRRRR" + res.status + data.message;
	}else{
		console.log("gato subido correctamente");
		console.log(data);
		console.log(data.url);
		saveFavouritesGato(data.id);//agregamos al gato a favoritos
	}
}

loadRandomCats();
favourites();

