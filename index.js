import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validation/validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('HI DEVELOPER');
});

//sign up
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//sign in
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
//get info
app.get('/auth/me', checkAuth, UserController.getMe);

//CRUD
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('server FINE');
});
