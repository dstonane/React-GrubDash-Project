const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
    res.json({ data: dishes })
  }

function findDish(req, res, next) {
  const { dishId } = req.params
  const foundDish = dishes.find((dish) => dish.id === dishId)
  if (foundDish) {
    res.locals.foundDish = foundDish
    return next()
  }
    next({ status: 404, message: `Dish does not exist ${dishId}`})
}

function validateDish(req, res, next) {
    const { data: {id, name, description, price, image_url} = {} } = req.body
    const newDish = {
        id,
        name,
        description,
        price,
        image_url
        }

    if(!name || name == ""){
        return next({status:400, message:"Dish must include a name"})
    }
    if(!description || description == ""){
        return next({status:400, message:"Dish must include a description"})
    }
    if(!price){
        return next({status:400, message:"Dish must include a price"})
    }
    if(price <= 0){
        return next({status:400, message:"Dish must have a price that is an integer greater than 0"})
    }
    if(!Number.isInteger(price)){
        return next({status:400, message:"Dish must have a price that is an integer greater than 0"})
    }
    if(!image_url || image_url == "" ){
        return next({status:400, message:"Dish must include a image_url"})
    }
    res.locals.newDish = newDish
    next()
}

function validateUpdate(req, res, next) {
    const { dishId } = req.params
    const newDish = res.locals.newDish

    if(newDish.id){
        if(newDish.id !== dishId){
            return next({status:400, message:`Dish id does not match route id.  Dish: ${newDish.id}, Route:${dishId}`})
        }
    }
    next()
}

function create(req, res) {
    const newDish = res.locals.newDish
    newDish.id = nextId()
    dishes.push(newDish)
    res.status(201).json({ data: newDish })
}

function read(req, res) {
    res.json({ data:res.locals.foundDish })
}

function update(req, res) {
    const { data: {name, description, price, image_url} ={} } = req.body
    const foundDish = res.locals.foundDish

    foundDish.name = name
    foundDish.description = description
    foundDish.price = price
    foundDish.image_url = image_url

    res.status(200).json({ data: foundDish })
}





module.exports = {
    list,
    read:[findDish, read],
    create:[validateDish, create],
    update:[findDish, validateDish, validateUpdate, update]
}