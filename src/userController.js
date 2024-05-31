/* eslint-disable camelcase */
import path from 'node:path'
import fs from 'node:fs/promises'
import { nuevoNombreArchivo } from '../config/multer.js'
import { pool } from '../config/db.js'

/* Gestión de Usuarios */
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body
  try {
    if (!nuevoNombreArchivo) {
      return res.status(500).json({ message: 'No se pudo subir la imagen' })
    }
    const [result] = await pool.query('INSERT INTO users (username, email, password, role, photoUser) VALUES (?, ?, ?, ?, ?)', [username, email, password, role, nuevoNombreArchivo])
    res.status(201).json({ message: 'Usuario nuevo creado con éxito', id: result.insertId, username, email, password, role, photoUser: nuevoNombreArchivo })
    console.log('Ruta de crear a un usuario POST http://localhost:3000/api/access/createUser')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const getUsers = async (req, res) => {
  const { id, username } = req.params
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ? AND username = ?', [id, username])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas' })
    }

    const user = userRows[0]

    // Verificar si el rol del usuario es 'Supervisor'
    if (user.role === 'admin') {
      console.log(`Ruta de ver todos los usuarios con el admin http://localhost:3000/api/access/${id}/${username}`)
      const [allUsers] = await pool.query('SELECT * FROM users')
      return res.status(200).json({ message: 'Accesso concedido para admin', allUsers })
    }

    // Si no es 'Supervisor', solo devolver la información del usuario
    res.status(200).json({ message: `Acesso concedido para user ${id}`, user })
    console.log(`Ruta de ver a un usuario GET http://localhost:3000/api/acess/${id}/${username}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const updateUser = async (req, res) => {
  const { id, nombre } = req.params
  const { username, email, password, role } = req.body

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE ID = ? AND username = ?', [id, nombre])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    let photoUser = rows[0].photoUser
    if (nuevoNombreArchivo) {
      photoUser = nuevoNombreArchivo
    }
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ?,  password = ?, role = ?, photoUser = ? WHERE ID = ?',
      [username, email, password, role, nuevoNombreArchivo, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json({ message: `El usuario ${username} ha sido modificado con éxito`, id, username, email, password, role, photoUser })
    console.log(`Ruta de actualizar a un usuario PUT http://localhost:3000/api/access/update/${id}/${username}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const deleteUserAndImage = async (req, res) => {
  const { id, nombre } = req.params

  try {
    const [rows] = await pool.execute('SELECT photoUser FROM users WHERE ID = ? AND username = ?', [id, nombre])

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const photoUser = rows[0].photoUser

    if (photoUser) {
      const rutaArchivo = path.resolve(`./uploads/photoUser/${photoUser}`)
      try {
        await fs.unlink(rutaArchivo)
        console.log('Imagen eliminada exitosamente')
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('No se encontró el archivo de imagen')
        } else {
          throw error
        }
      }
    }

    const [result] = await pool.query('DELETE FROM users WHERE ID = ? AND username = ?', [id, nombre])

    if (result.affectedRows === 1) {
      console.log(`Ruta de eliminar a un usuario DELETE http://localhost:3000/api/access/delete/${id}/${nombre}`)
      return res.status(200).json({ message: 'Se eliminó el usuario correctamente' })
    }

    res.status(500).json({ message: 'Error al eliminar el usuario' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/* Gestión de Publicaciones */
export const createPost = async (req, res) => {
  const { id, nombre } = req.params
  const { title, content, categories } = req.body
  try {
    // Verificar si el usuario existe
    const [rows] = await pool.execute('SELECT * FROM users WHERE ID = ? AND username = ?', [id, nombre])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Verificar si se proporcionaron categorías
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Debes proporcionar al menos una categoría para la publicación' })
    }

    // Verificar si se subió la imagen (supongo que utilizas 'nuevoNombreArchivo' para la imagen)
    if (!nuevoNombreArchivo) {
      return res.status(500).json({ message: 'No se pudo subir la imagen' })
    }

    // Crear la publicación
    const [postResult] = await pool.query('INSERT INTO posts (user_id, title, image, content) VALUES (?, ?, ?, ?)', [id, title, nuevoNombreArchivo, content])
    const postId = postResult.insertId

    // Asociar las categorías a la publicación
    for (const category of categories) {
      // Buscar la categoría en la base de datos
      const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category])
      if (categoryRows.length === 0) {
        // Si la categoría no existe, puedes decidir qué hacer aquí, como ignorarla o lanzar un error
        console.log(`La categoría '${category}' no existe en la base de datos`)
        continue
      }
      const categoryId = categoryRows[0].id
      // Asociar la categoría a la publicación
      await pool.query('INSERT INTO postcategories (post_id, category_id) VALUES (?, ?)', [postId, categoryId])
    }

    // Devolver una respuesta exitosa
    res.status(201).json({
      message: 'Publicación nueva creada con éxito',
      id: postId,
      user_id: id,
      title,
      image: nuevoNombreArchivo,
      content,
      categories // Devolver las categorías en la respuesta
    })

    console.log('Ruta de crear a una publicación POST http://localhost:3000/api/access/createUser')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const deletePostAndImageAndComments = async (req, res) => {
  const { id, user_id } = req.params
  try {
    const [postRows] = await pool.execute('SELECT image FROM posts WHERE ID = ? AND user_id = ?', [id, user_id])
    if (postRows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    const photoPost = postRows[0].image
    if (photoPost) {
      const rutaArchivo = path.resolve(`./uploads/image/${photoPost}`)
      try {
        await fs.unlink(rutaArchivo)
        console.log(`Imagen del post ${id} eliminada exitosamente`)
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('No se encontró el archivo de imagen')
        } else {
          throw error
        }
      }
    }

    await pool.query('DELETE FROM postcategories WHERE post_id = ?', [id])

    await pool.query('DELETE FROM comments WHERE post_id = ?', [id])

    const [result] = await pool.query('DELETE FROM posts WHERE ID = ? AND user_id = ?', [id, user_id])

    if (result.affectedRows === 1) {
      console.log(`Ruta de eliminar a un post DELETE http://localhost:3000/api/post/delete/${id}/${user_id}`)
      return res.status(200).json({ message: `Se eliminó el post ${id} correctamente` })
    }

    res.status(500).json({ message: 'Error al eliminar la publicación' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const updatePost = async (req, res) => {
  const { id, codePost } = req.params
  const { title, content, categories } = req.body
  try {
    const [rows] = await pool.execute('SELECT * FROM posts WHERE ID = ? AND user_id = ?', [id, codePost])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: 'Debes proporcionar un array de categorías para la publicación' })
    }

    // Modificar los campos de la publicación
    let query = 'UPDATE posts SET'
    const values = []

    // Agregar título y contenido a la consulta de actualización
    if (title) {
      query += ' title = ?,'
      values.push(title)
    }
    if (content) {
      query += ' content = ?,'
      values.push(content)
    }

    // Si hay una nueva imagen, agregarla a la consulta de actualización
    if (nuevoNombreArchivo) {
      query += ' image = ?,'
      values.push(nuevoNombreArchivo)
    }

    // Eliminar la coma extra al final de la consulta
    query = query.slice(0, -1)

    // Agregar el ID de la publicación al array de valores
    values.push(id)

    // Ejecutar la consulta de actualización
    const [result] = await pool.query(query + ' WHERE ID = ?', values)

    // Verificar si se afectó alguna fila (es decir, si la publicación se actualizó correctamente)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'La publicación no pudo ser actualizada' })
    }

    // Actualizar las categorías asociadas a la publicación
    await updatePostCategories(id, categories)

    // Devolver una respuesta exitosa
    res.status(200).json({
      message: 'Publicación modificada con éxito',
      id,
      title,
      image: nuevoNombreArchivo || rows[0].image,
      content,
      categories
    })

    console.log(`Ruta de actualizar una publicación PUT http://localhost:3000/api/access/update/${id}/${codePost}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// Función para actualizar las categorías asociadas a una publicación
const updatePostCategories = async (postId, categories) => {
  // Eliminar todas las categorías asociadas a la publicación
  await pool.query('DELETE FROM postcategories WHERE post_id = ?', [postId])

  // Asociar las nuevas categorías a la publicación
  for (const category of categories) {
    // Buscar la categoría en la base de datos
    const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category])
    if (categoryRows.length === 0) {
      // Si la categoría no existe, puedes decidir qué hacer aquí, como ignorarla o lanzar un error
      console.log(`La categoría '${category}' no existe en la base de datos`)
      continue
    }
    const categoryId = categoryRows[0].id

    // Asociar la categoría a la publicación
    await pool.query('INSERT INTO postcategories (post_id, category_id) VALUES (?, ?)', [postId, categoryId])
  }
}
// READ post
export const getPostByTitle = async (req, res) => {
  const { title } = req.params
  try {
    const [rows] = await pool.query('SELECT * FROM posts WHERE title = ?', [title])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }
    res.status(200).json(rows[0])
    console.log(`Ruta de ver a una publicación GET http://localhost:3000/api/post/view/${title}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const getPostOwn = async (req, res) => {
  const { user } = req.params
  try {
    const [rows] = await pool.query('SELECT * FROM posts WHERE user_id = ?', [user])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }
    res.status(200).json({ message: `Lista de publicaciones mi cuenta ${user}`, rows })
    console.log(`Ruta de ver a una publicación GET http://localhost:3000/api/post/view/${user}/myposts`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const getPostCommunity = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts')

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron publicaciones' })
    }

    res.status(200).json({ message: 'Lista total de publicaciones', rows })
    console.log('Ruta de ver todas las publicaciones de la comunidad GET http://localhost:3000/api/posts/view/community')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const getCategory = async (req, res) => {
  const { nameCategory } = req.params
  try {
    const [categoryRows] = await pool.query('SELECT * FROM categories WHERE name = ?', [nameCategory])
    if (categoryRows.length === 0) {
      return res.status(404).json({ message: 'Categoria no encontrada' })
    }

    const categoryId = categoryRows[0].id
    const [postRows] = await pool.query(`
    SELECT p.* 
    FROM posts p
    INNER JOIN postcategories pc ON p.id = pc.post_id
    WHERE pc.category_id = ?
    `, [categoryId])

    if (postRows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron publicaciones para esta categoría' })
    }

    res.status(200).json({ message: `Lista de publicaciones de la categoria ${nameCategory}`, postRows })
    console.log(`Ruta de ver publicaciones de la categoría ${nameCategory}: GET http://localhost:3000/api/post/view/category/${nameCategory}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
/* Gestión de Categories */
export const getAllCategories = async (req, res) => {
  const { id, username } = req.params
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ? AND username = ?', [id, username])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas' })
    }

    const user = userRows[0]

    if (user.role === 'admin') {
      console.log(`Ruta de ver todos las categorias con el admin http://localhost:3000/api/access/${id}/${username}/allCategories`)
      const [allCategories] = await pool.query('SELECT * FROM categories')
      return res.status(200).json({ message: 'Accesso concedido para admin', allCategories })
    }

    res.status(200).json({ message: 'Acesso denegado: no tienes permiso de ver las categorias' })
    console.log('Ruta denegada para ver categorias')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const createCategory = async (req, res) => {
  const { id, username } = req.params
  const { name } = req.body
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ? AND username = ?', [id, username])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas' })
    }

    const user = userRows[0]

    if (user.role === 'admin') {
      console.log(`Ruta de ver todos las categorias con el admin http://localhost:3000/api/access/${id}/${username}/allCategories`)
      const [allCategories] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name])
      return res.status(200).json({ message: 'Categoria nueva creado con éxito', id: allCategories.insertId, name })
    }

    res.status(200).json({ message: 'Acesso denegado: no tienes permiso de crear una categoria' })
    console.log('Ruta denegada para ver categorias')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const updateCategory = async (req, res) => {
  const { id, username, idCategory } = req.params
  const { name } = req.body
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ? AND username = ?', [id, username])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas' })
    }

    const user = userRows[0]

    if (user.role === 'admin') {
      const [categoryRows] = await pool.query('SELECT * FROM categories WHERE ID = ?', [idCategory])
      if (categoryRows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' })
      }

      await pool.query('UPDATE categories SET name = ? WHERE ID = ?', [name, idCategory])
      console.log('Ruta de actualizar a una categoria PUT http://localhost:3000/api/post/:post_id/comment/:id/:user_id')
      return res.status(200).json({ message: `La categoría ${name} ha sido modificada con éxito`, id: idCategory, name })
    }

    res.status(403).json({ message: 'Acceso denegado: no tienes permiso para modificar una categoría' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const deleteCategory = async (req, res) => {
  const { id, username, idCategory } = req.params
  const { name } = req.body
  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ? AND username = ?', [id, username])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o credenciales inválidas' })
    }

    const user = userRows[0]

    if (user.role === 'admin') {
      const [categoryRows] = await pool.query('SELECT * FROM categories WHERE ID = ?', [idCategory])
      if (categoryRows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' })
      }

      await pool.query('DELETE FROM postcategories WHERE category_id = ?', [idCategory])
      await pool.query('DELETE FROM categories WHERE ID = ?', [idCategory])
      console.log('Ruta de eliminar a una categoria DELETE http://localhost:3000/api/access/:id/:username/categories/:idCategory')
      return res.status(200).json({ message: `La categoría ${name} del id ${idCategory} ha sido eliminada con éxito de 'categories' y 'postcategories`, id: idCategory, name })
    }

    res.status(403).json({ message: 'Acceso denegado: no tienes permiso para eliminar una categoría' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
/* Gestión de Comentarios */
export const getAllComments = async (req, res) => {
  const { post_id } = req.params

  try {
    const [comments] = await pool.query('SELECT * FROM comments WHERE post_id = ?', [post_id])

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para esta publicación' })
    }

    res.status(200).json({ message: `Comentarios encontrados en el post ${post_id}`, comments })
    console.log(`Ruta de ver todos los comentarios de una publicación GET http://localhost:3000/api/post/${post_id}/comments`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const createCommentary = async (req, res) => {
  const { post_id, user_id } = req.params
  const { content } = req.body

  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE ID = ?', [user_id])
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const [postRows] = await pool.query('SELECT * FROM posts WHERE ID = ?', [post_id])
    if (postRows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' })
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [post_id, user_id, content]
    )

    res.status(201).json({ message: `Comentario en el post ${post_id} creado con éxito`, id: result.insertId, post_id, user_id, content })
    console.log(`Ruta de crear un comentario POST http://localhost:3000/api/post/${post_id}/createComment/${user_id}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const deleteCommentary = async (req, res) => {
  const { post_id, id, user_id } = req.params

  try {
    const [commentRows] = await pool.query('SELECT * FROM comments WHERE ID = ? AND post_id = ? AND user_id = ?', [id, post_id, user_id])
    if (commentRows.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado o no tienes permiso para eliminar este comentario' })
    }

    const comment = commentRows[0].content

    await pool.query('DELETE FROM comments WHERE ID = ?', [id])

    res.status(200).json({ message: 'Comentario eliminado con éxito', id, content: comment })
    console.log(`Ruta de eliminar un comentario DELETE http://localhost:3000/api/post/${post_id}/comment/${id}/${user_id}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const updateCommentary = async (req, res) => {
  const { post_id, id, user_id } = req.params
  const { content } = req.body

  try {
    const [commentRows] = await pool.query('SELECT * FROM comments WHERE ID = ? AND post_id = ? AND user_id = ?', [id, post_id, user_id])
    if (commentRows.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado o no tienes permiso para modificar este comentario' })
    }

    const [result] = await pool.query('UPDATE comments SET content = ?, updated_at = NOW() WHERE ID = ?', [content, id])

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Error al actualizar el comentario' })
    }

    res.status(200).json({ message: 'Comentario actualizado con éxito', id, content })
    console.log(`Ruta de actualizar un comentario PUT http://localhost:3000/api/post/${post_id}/comment/${id}/${user_id}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
