import { it, expect } from '@jest/globals';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import App from './App';

it('publica texto, atualiza o perfil e mantém a publicação ao navegar', () => {
  render(<App />);
  fireEvent.press(screen.getByText('+  Compartilhar história'));
  fireEvent.press(screen.getByText('Publicar'));
  expect(screen.getByText('Sua nova história')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Texto da publicação'), 'Treino de domingo com a comunidade');
  fireEvent.press(screen.getByText('Publicar'));
  expect(screen.getByText('Treino de domingo com a comunidade')).toBeTruthy();
  fireEvent.press(screen.getByLabelText('Curtir publicação de Você'));
  expect(screen.getByText('♥  1 curtidas')).toBeTruthy();
  fireEvent.press(screen.getByText('Perfil'));
  expect(screen.getByText('Treino de domingo com a comunidade')).toBeTruthy();
  fireEvent.press(screen.getByText('Editar perfil'));
  fireEvent.changeText(screen.getByLabelText('Nome do perfil'), 'Ana');
  fireEvent.changeText(screen.getByLabelText('Biografia'), 'Corredora de trilha');
  fireEvent.press(screen.getByText('Salvar perfil'));
  expect(screen.getByText('Ana')).toBeTruthy();
  expect(screen.getByText('Corredora de trilha')).toBeTruthy();
});

it('filtra provas, mostra estado vazio e alterna interesse', () => {
  render(<App />);
  fireEvent.press(screen.getByText('Provas'));
  fireEvent.press(screen.getByText('Trilha'));
  expect(screen.getByText('Desafio da Serra')).toBeTruthy();
  expect(screen.queryByText('Circuito do Parque')).toBeNull();
  fireEvent.press(screen.getByText('Marcar interesse'));
  expect(screen.getByText('✓  Tenho interesse')).toBeTruthy();
  fireEvent.press(screen.getByText('✓  Tenho interesse'));
  expect(screen.getByText('Marcar interesse')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Buscar provas por nome ou cidade'), 'cidade inexistente');
  expect(screen.getByText('Nenhuma prova encontrada')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Buscar provas por nome ou cidade'), 'Curitiba');
  expect(screen.getByText('Desafio da Serra')).toBeTruthy();
});
