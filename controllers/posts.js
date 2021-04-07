import express from 'express'
import mongoose from 'mongoose'

import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();

    return res.status(202).json(postMessage);
  } catch (error) {

    return res.status(404).json({
      message: error.message
    })
  }
}

export const createPost = async (req, res) => {

  const post = req.body

  const newMessage = new PostMessage ({
    ...post, 
    creator: req.userId,
    createdAt: new Date().toISOString()
  })
  try {
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {

    return res.status(409).json({
      message: error.message
    })
  }
}

export const updatePost = async (req, res) => {
  const {id} = req.params
  const {creator, title, message, tags, selectedFile } = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).send(`No Post with id: ${id}`)
  }
  
  const postUpdate = {creator, title, message, tags, selectedFile, _id: id}
  try {
    await PostMessage.findByIdAndUpdate(id, postUpdate, {new: true})
    return res.json(postUpdate)
    
  } catch (error) {
    return res.status(409).json({
      message: error.message
    })
  }

}

export const deletePost = async (req, res) => {
  const {id} = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).send(`No Post with id: ${id}`)
  }

  try {
    await PostMessage.findByIdAndRemove(id)

    return res.json({
      message: 'Post deleted successfully'
    })

  } catch (error) {
    return res.status(409).json({
      message: error.message
    })
  }
}

export const likePost = async (req, res) => {

  const {id} = req.params

  if(!req.userId) return res.json({
    message: 'This User Unauthenticated ...'
  })

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).send(`No Post with id: ${id}`)
  }

  try {
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex(id => id === String(req.userId));

    if(index === -1){
      post.likes.push(req.userId)
    }else{
      post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
      id, 
      post,
      {new: true},)

    return res.json(updatedPost)
    
  } catch (error) {
    return res.status(409).json({
      message: error.message
    })
  }
}