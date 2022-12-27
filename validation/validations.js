import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен иметь минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен иметь минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Имя пользователя должно иметь минимум 2 символа').isLength({ min: 2 }),
  body('avatarUrl', 'Неверный формат ссылки').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи(мин. 5 символов)').isLength({ min: 3 }),
  body('tags', 'Неверный формат тэгов(укажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
