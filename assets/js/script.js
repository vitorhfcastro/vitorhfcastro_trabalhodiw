const apiURLAlbums = "https://json-server-diw.andrejales1.repl.co/albuns/";
const apiURLFotos = "https://json-server-diw.andrejales1.repl.co/fotos/";
const apiURLDestaques = "https://json-server-diw.andrejales1.repl.co/destaques/";
const checkbox = $('#myHeart');
const label = $('.heart-label');
var map;
var albuns = [];

function showAlbums(albums) {
    albuns = albums;
    let containerAlbums = $("#container-albums");
    let currentRow;
    for (let i = 0; i < albums.length; i++) {
        if (i % 4 === 0) {
            currentRow = $('<div class="row row-cols-1 row-cols-md-4">');
            containerAlbums.append(currentRow);
        }

        $(`<div class="col">
            <div class="card p-0 m-2">
                <img
                    src="${albums[i].imagem}"
                    class="card-img-top"
                    alt="${albums[i].titulo}"
                />
                <div class="card-body">
                    <h5 class="card-title">${albums[i].titulo}</h5>
                    <p class="card-text">${albums[i].descricaoCurta}</p>
                    <a href="album.html?id=${albums[i].id}" class="btn btn-primary">Ver álbum</a>
                </div>
            </div>
        </div>`).appendTo(currentRow);

        if ($('#map').length)
        {
            let coordenadas = albums[i].localizacao.split(',').map(coord => parseFloat(coord.trim()));
            var marker = new mapboxgl.Marker()
                .setLngLat([coordenadas[0], coordenadas[1]])
                .setPopup(new mapboxgl.Popup().setHTML(`<p><a href="album.html?id=${albums[i].id}">${albums[i].titulo}</a></p>`))
                .addTo(map);
        }
    }
}

function showItems(items, albumID) {
    let filteredItems = items.filter(item => item.album == albumID);
    const containerItems = $('.container-items');
    const carouselInner = $('.carousel-inner');
    let currentRow;
    for (let i = 0; i < filteredItems.length; i++) {
        if (i % 4 === 0) {
            currentRow = $('<div class="row row-cols-1 row-cols-md-4">');
            containerItems.append(currentRow);
        }
        
        $(`<div class="col">
        <div class="card p-0 m-2">
          <img
            src="${filteredItems[i].url}"
            class="card-img-top"
            alt="${filteredItems[i].titulo}"
          />
          <div class="card-body">
            <h5 class="card-title">${filteredItems[i].titulo}</h5>
            <p class="card-text">
            ${filteredItems[i].descricao}
            </p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#carouselModal"><span data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}">Ver item</span></button>
          </div>
        </div>
      </div>`).appendTo(currentRow);

      if (i == 0) {
        $(`<div class="carousel-item active">
        <img src="${filteredItems[i].url}" class="d-block" alt="${filteredItems[i].titulo}">
        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
          <h5>${filteredItems[i].titulo}</h5>
          <p>${filteredItems[i].descricao}</p>
        </div>
      </div>`).appendTo(carouselInner);
      }
      else {
        $(`<div class="carousel-item">
        <img src="${filteredItems[i].url}" class="d-block" alt="${filteredItems[i].titulo}">
        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
          <h5>${filteredItems[i].titulo}</h5>
          <p>${filteredItems[i].descricao}</p>
        </div>
      </div>`).appendTo(carouselInner);
      }
    }
}

function showAlbum(albums) {
    let params = new URLSearchParams(location.search);
    let id = params.get('id');
    let album = albums.find(function (elem) {return elem.id == id});
    $('#carouselModalLabel').text(`${album.titulo}`);
    if (album) {
        const albumTitle = $('.album-title');
        albumTitle.text(`Álbum ${album.titulo}`);
        const albumImage = $('.album-imagem');
        albumImage.attr("src", `${album.imagem}`);
        const albumDescription = $('.album-descricao');
        albumDescription.text(`${album.descricao}`);
        const albumLocation = $('.album-localizacao');
        albumLocation.text(`${album.localizacao}`);
        const albumDate = $('.album-data');
        albumDate.text(`${album.data}`);

        fetch(apiURLFotos, {
            method: 'GET',
            headers: { 'Content-Type': 'application/JSON' }
          })
            .then(res => res.json())
            .then(data => {if($(".container-items").length){showItems(data, id)}})
            .catch(error => {
              console.error(error)
            });

    }
}

function showDestaques(destaques) {
    console.log(destaques);
    fetch(apiURLFotos, {
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' }
      })
        .then(res => res.json())
        .then(data => {
            let fotos = data;
            let carousel = $('.carousel-destaques');
            let albumID;
            let fotoDescription;
            let filteredFotos = [];

            for (let i = 0; i < destaques.length; i++) {
                albumID = destaques[i].album;
                fotoDescription = destaques[i].descricao;
                filteredFotos = fotos.filter(item => item.album == albumID);
                console.log(filteredFotos);
                for (let c = 0; c < filteredFotos.length; c++) {
                    if (i == 0 && c == 0) {
                        $(`<div class="carousel-item active">
                        <img src="${filteredFotos[i].url}" class="w-100 m-auto" alt="${filteredFotos[i].titulo}">
                        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
                            ${destaques[i].descricao}
                        </div>
                    </div>`).appendTo(carousel);
                        console.log(carousel.html() + "Legal");
                    }
                    else {
                        $(`<div class="carousel-item">
                        <img src="${filteredFotos[c].url}" class="w-100 m-auto" alt="${filteredFotos[c].titulo}">
                        <div class="carousel-caption d-none d-md-block bg-dark opacity-75">
                            ${destaques[i].descricao}
                        </div>
                    </div>`).appendTo(carousel);
                    console.log(carousel.html() + "Deslegal");
                    }
                }
            }
        })
        .catch(error => {
          console.error(error)
        });

}

$(document).ready(function () {
    if($('#map').length) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVqYWxlcyIsImEiOiJjbHBuMW1qbDMwZDBpMmhvNXFidm5rcTQ0In0.c_P2-57ihjJdk378BlCcbA';

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-43.938641, -19.919118],
            zoom: 10,
        });
    }
    
    fetch(apiURLAlbums, {
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' }
      })
        .then(res => res.json())
        .then(data => {if($("#container-albums").length){showAlbums(data)} else if($('.album').length){showAlbum(data)}})
        .catch(error => {
          console.error(error)
        });

    fetch(apiURLDestaques, {
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' },
    })
        .then(res => res.json())
        .then(data => {
            let params = new URLSearchParams(location.search);
            let id = params.get('id');
            for (const dest of data) {
                if (dest.album == id) {
                    checkbox.prop('checked', true);
                    label.html('<img src="assets/img/heart-full.png" class="heart-img">');
                }
            }
            if($('.carousel-destaques').length){showDestaques(data)}})
        .catch(error => {
            console.error(error)
        })

    checkbox.change(function () {
        if (this.checked) {
            
            let params = new URLSearchParams(location.search);
            let id = params.get('id');

            label.html('<img src="assets/img/heart-full.png" class="heart-img">');
            fetch(apiURLDestaques, {
                method: 'POST',
                headers: { 'Content-Type': 'application/JSON' },
                body: JSON.stringify({album: parseInt(id), descricao: `${$('.album-title').text()}`}),
            })
            .then(res => res.json())
            .catch(error => {
                console.error(error)
            })
            
            
        } else {
            let destaques;
            label.html('<img src="assets/img/heart.png" class="heart-img">');

            let params = new URLSearchParams(location.search);
            let id = params.get('id');

            fetch(apiURLDestaques, {
                method: 'GET',
                headers: { 'Content-Type': 'application/JSON' },
            })
            .then(res => res.json())
            .then(data => {
                destaques = data;
                destaquesFiltrados = destaques.filter(destaque => destaque.album == id);
                for (const destaque of destaquesFiltrados) {
                    fetch(`${apiURLDestaques}${destaque.id}`, {
                        method: 'DELETE',
                    })
                    .catch(error => console.error(error));
                }
            })
            .catch(error => {
                console.error(error)
            })
        }
    });
});

