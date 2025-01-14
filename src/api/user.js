/* eslint-disable no-restricted-globals */
import supabase from '../supabase'
export const { data: user } = await supabase.auth.getUser()

async function register(data) {
  const { email, password } = data
  try {
    const { data: _error } = await supabase.auth.signUp({
      email: `${email}`,
      password: `${password}`,
    })
    const { error } = await supabase
      .from('users')
      .insert([{ email: `${email}`, password: `${password}` }])
      .single()
    if (error) throw error
  } catch (e) {
    throw e
  }
}

async function login(data) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) throw error
    const { data: _user } = await supabase.from('users').select().match({ id: user.id }).single()
    document.location.replace('https://maksimka241e.github.io/sorites/#/login')
    document.location.reload()
  } catch (e) {
    throw e
  }
}

async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    document.location.reload()
    if (error) throw error
    return null
  } catch (e) {
    throw e
  }
}

async function shoppinCart(dates) {
  const { price, title, url } = dates
  if (user.user != null) {
    try {
      const { data, error } = await supabase
        .from('basket')
        .insert({ email: user.user.email, price: price, url: url, title: title })
        .eq('email', user.user.email)
        .select()
      if (error) throw error
      return { data }
    } catch (e) {
      document.location.reload()
      throw e
    }
  } else {
    alert('Автолизируйтесь')
  }
}

async function deleteCart(index) {
  const { data, error } = await supabase.from('basket').delete().eq('id', index)
  document.location.reload()
}

async function shoppinFavourites(dates) {
  const { price, title, url } = dates
  if (user.user != null) {
    try {
      const { data, error } = await supabase
        .from('favourites')
        .insert({ email: user.user.email, price: price, title: title, url: url })
        .eq('email', user.user.email)
        .select()
      if (error) throw error
      return { data }
    } catch (e) {
      document.location.reload()
      throw e
    }
  } else {
    alert('Автолизируйтесь')
  }
}

async function deleteFavourites(index) {
  const { data, error } = await supabase.from('favourites').delete().eq('id', index)
  document.location.reload()
}

const userApi = { register, login, logout, shoppinCart, deleteCart, shoppinFavourites, deleteFavourites }
export default userApi
//  const newBasket = basket.filter((item, index) => index !== indexs)
//  {modal === false ? '' : <FavModal/>}
// modal === true ? setTimeout(() => {SetModal(false)},1400) : setTimeout(() => {SetModal(false)},100)
