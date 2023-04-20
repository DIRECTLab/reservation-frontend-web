import api from "../api";

const FavoriteChargers = ({token, encodedToken}) => {
  return (
    <button className='btn' type='button' onClick={async () => {
      const res = await api.favorites.get({ params: { UserId: token.id }}, encodedToken);
      console.log(res);
    }}>PUSH ME</button>
  )
}

export default FavoriteChargers;