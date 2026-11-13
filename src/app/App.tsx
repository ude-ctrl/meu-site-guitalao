import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { StudyPage } from '../pages/StudyPage';
import { PracticePage } from '../pages/PracticePage';
import styles from './App.module.css';

function Shell() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  const practice = pathname === '/praticar';
  useEffect(() => {
    document.title = `${practice ? 'Praticar' : 'Estudo'} | Meu SiteGuitaLao`;
    if (previousPath.current !== pathname) main.current?.focus();
    previousPath.current = pathname;
  }, [pathname, practice]);
  return (
    <div className={`${styles.shell} ${practice ? styles.practice : ''}`}>
      <a
        className={styles.skip}
        href="#conteudo"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <header className={styles.header}>
        <span className={styles.brand}>Meu SiteGuitaLao</span>
        <nav aria-label="Modo de navegação" className={styles.modes}>
          {[
            ['/estudo', 'Estudo'],
            ['/praticar', 'Praticar'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="conteudo" ref={main} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>Fundação técnica · F0</footer>
    </div>
  );
}
export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Navigate to="/estudo" replace />} />
        <Route path="estudo" element={<StudyPage />} />
        <Route path="praticar" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/estudo" replace />} />
      </Route>
    </Routes>
  );
}
