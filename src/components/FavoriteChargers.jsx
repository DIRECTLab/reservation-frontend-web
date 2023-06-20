import { useEffect, useState } from "react";
import api from "../api";

const FavoriteChargers = ({token, encodedToken}) => {
  const [favoriteChargers, setFavoriteChargers] = useState([])

  const getFavorites = async () => {
    const res = await api.favorites.get({ params: { UserId: token.id }}, encodedToken)
    if (res.error) {
      // Make this alert
    }
    setFavoriteChargers(res.data.FavoriteChargers)
  }

  useEffect(() => {
    getFavorites();
  }, [])

  return (
    <>
      {favoriteChargers.map((charger, idx) => 
        <button key={idx} className='btn' type='button' onClick={() => {console.log(charger)}}>PUSH ME</button>
      )}
    </>
  )
}

export default FavoriteChargers;