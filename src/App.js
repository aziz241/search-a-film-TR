import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [films, setFilms] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFilm, setSelectedFilm] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    document.title = "Film Listesi";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNDk0MDAyOWE0MGE1Mjk5NWI2MzM2NzljY2ExOTdhYiIsIm5iZiI6MTczMTI4OTQ2OS45MTYzMDEzLCJzdWIiOiI2NGEyZTliMmU5ZGE2OTAxMWU1N2E1ODkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.XAnGNKDhqtFzmuV6Qzq059uJ6uHfLuL4GzOBbMq-ZuM",
      },
    };
    setSelectedFilm("");
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&language=tr-TR&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setFilms(res.results);

        return res;
      })
      .catch((err) => console.error(err));
  }, [search]);

  function SelectedFilm(film) {
    // Film detay sayfasına yönlendirme yapılması gerekiyor

    setSelectedFilm(films.filter((film_) => (film_.id === film ? film_ : "")));

    // setSelectedFilm(filtered);
    // console.log(filtered);
  }
  function addList(film) {
    const id = film.id;
    if (list.some((item) => item.id === id)) {
      alert("Bu filmi zaten listeye eklediniz!");
      return;
    }

    setList([...list, film]);

    //
  }

  function removeList(film) {
    const filtered = list.filter((item) => (item.id !== film.id ? item : null));
    setList(filtered);
  }
  return (
    <div className="app">
      <SearchFilm search={search} setSearch={setSearch} />
      <div className="panel">
        <GetFilms
          list={list}
          films={films}
          onSelect={SelectedFilm}
          selectedFilm={selectedFilm}
          addList={addList}
        />
        <GetFilmDetay selectedFilm={selectedFilm} />
      </div>
      <div className="favorites">
        <GetMyList removeList={removeList} list={list} />
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SearchFilm({ search, setSearch }) {
  return (
    <div className="sidebar">
      <h2>Film Ara</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
      />
    </div>
  );
}

function GetFilms({ films, onSelect, selectedFilm, addList }) {
  // Aranan ve bulunan filmleri getir
  function handleClick(e) {
    onSelect(e);
  }

  return (
    <div className="films">
      <h2>Filmler</h2>
      <div className="film-list">
        {
          <ul>
            {films &&
              films.map((film) => {
                return (
                  <li
                    key={film.id}
                    className={`margin-top-5  ${
                      selectedFilm && selectedFilm[0].id === film.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleClick(film.id)}
                  >
                    <div className="film-list-film">
                      <img
                        src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path}`}
                        alt="Film Poster"
                      />
                      <div className="film-list-detay">
                        <h3>{film.title}</h3>
                        <p>Popülarite: {film.popularity}</p>
                        <p>Çıkış Tarihi: {film.release_date}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          addList(film, e);
                        }}
                        className="buton-sec"
                        style={{
                          zIndex: "99",
                        }}
                      >
                        Listeye Ekle
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        }
      </div>
    </div>
  );
}

function GetFilmDetay({ selectedFilm }) {
  // Seçilen filmin detaylarını al
  return (
    <div className={`film-detay`}>
      {selectedFilm && (
        <>
          <h2>Film Detayları</h2>
          <div className="film-detay-bilgi">
            <img
              src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${selectedFilm[0].poster_path}`}
              alt="Film Poster"
            />
            <div className="film-detay-info">
              <h3>Film Adı: {selectedFilm[0].title}</h3>
              <p>{selectedFilm[0].popularity}</p>
              <p> {selectedFilm[0].release_date}</p>
              <span> {selectedFilm[0].overview}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GetMyList({ list, removeList }) {
  // Seçili filmi favorilere ekle

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Favorilerim</h1>
      {list.map((film, i) => (
        <div key={i} className="getmylist">
          <div className="myList">
            <div className="myList-img">
              <img
                src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path}`}
                alt="Film Poster"
              />
            </div>
            <div className="myList-detay">
              <h3>{film.title}</h3>
              <p>Popularite: {film.popularity}</p>
            </div>
            <button onClick={() => removeList(film)} className="buton-sec">
              Kaldır
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
