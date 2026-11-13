import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

beforeEach(() => {
  window.location.hash = '';
});
function renderApp(path = '') {
  window.location.hash = path;
  return render(
    <HashRouter>
      <App />
    </HashRouter>,
  );
}
describe('Fundação e navegação', () => {
  it('abre Estudo por padrão com estrutura semântica', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Estudo' })).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Modo de navegação' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Estudo' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
  it('alterna os modos por teclado e move o foco ao conteúdo', async () => {
    const user = userEvent.setup();
    renderApp('/estudo');
    await user.tab();
    expect(
      screen.getByRole('link', { name: 'Pular para o conteúdo' }),
    ).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Praticar' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(
      await screen.findByRole('heading', { name: 'Praticar' }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('#/praticar');
    expect(screen.getByRole('main')).toHaveFocus();
    await user.click(screen.getByRole('link', { name: 'Estudo' }));
    expect(screen.getByRole('heading', { name: 'Estudo' })).toBeInTheDocument();
  });
  it('abre Praticar por link direto', () => {
    renderApp('/praticar');
    expect(
      screen.getByRole('heading', { name: 'Praticar' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Praticar' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
  it('redireciona rotas desconhecidas para Estudo', async () => {
    renderApp('/inexistente');
    await waitFor(() => expect(window.location.hash).toBe('#/estudo'));
  });
  it('pula para o conteúdo sem alterar a rota hash', async () => {
    const user = userEvent.setup();
    renderApp('/praticar');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(window.location.hash).toBe('#/praticar');
  });
});
