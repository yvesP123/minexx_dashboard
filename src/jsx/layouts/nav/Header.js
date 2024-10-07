import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutPage from './Logout';
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { ThemeContext } from '../../../context/ThemeContext';
import { useOutletContext } from 'react-router-dom';

const translations = {
  en: {
    dashboard: "Dashboard",
    EN: "En",
    FR: "Fr",
    switchTo: "Switch to",
    Logout: "Logout",
    changeCountry: "Change Country"
  },
  fr: {
    dashboard: "Tableau de bord",
    EN: "EN",
    FR: "Fr",
    switchTo: "Passer à",
    Logout: "Déconnexion",
    changeCountry: "Changer de Pays"
  }
};

const Header = ({ onNote, toggle, onProfile, onNotification, onClick, onLanguageChange, onCountryChange }) => {
  const { title } = useContext(ThemeContext);
  const [user] = useState(JSON.parse(localStorage.getItem(`_authUsr`)));
  const [access, setAccess] = useState('');
  const [view, setView] = useState(localStorage.getItem(`_dash`) || '');
  const [lang, setLang] = useState(localStorage.getItem(`_lang`) || `en`);
  const [country, setCountry] = useState(localStorage.getItem(`_country`) || 'Rwanda');

  const navigate = useNavigate();

  const countries = {
    'Rwanda': 'https://flagcdn.com/w320/rw.png',
    'DRC': 'https://flagcdn.com/w320/cd.png',
    'Gabon': 'https://flagcdn.com/w320/ga.png',
    'Ghana': 'https://flagcdn.com/w320/gh.png',
    'France': 'https://flagcdn.com/w320/fr.png'
  };

  useEffect(() => {
    updateAccessAndView(country);
    updateLanguageBasedOnCountry(country);
  }, [country]);

  const updateAccessAndView = (selectedCountry) => {
    let newAccess = '';
    let newView = '';
  
    switch (selectedCountry) {
      case 'Rwanda':
      case 'DRC':
        newAccess = '3ts';
        newView = '3ts';
        break;
      case 'Gabon':
      case 'Ghana':
        newAccess = 'gold';
        newView = 'gold';
        break;
      case 'France':
        newAccess = 'both';
        newView = view || 'gold';
        break;
      default:
        newAccess = '3ts';
        newView = '3ts';
    }
  
    setAccess(newAccess);
    setView(newView);
    localStorage.setItem(`_dash`, newView);
  };

  const updateLanguageBasedOnCountry = (selectedCountry) => {
    let newLang;
    switch (selectedCountry) {
      case 'Rwanda':
      case 'Ghana':
        newLang = 'en';
        break;
      case 'DRC':
      case 'France':
      case 'Gabon':
        newLang = 'fr';
        break;
      default:
        newLang = 'en';
    }
    setLang(newLang);
    localStorage.setItem(`_lang`, newLang);
    onLanguageChange(newLang);
  };

  const changeLanguage = () => {
    const newLang = lang === `en` ? `fr` : `en`;
    setLang(newLang);
    localStorage.setItem(`_lang`, newLang);
    onLanguageChange(newLang);
  }

  const changeCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    localStorage.setItem(`_country`, selectedCountry);
    updateAccessAndView(selectedCountry);
    updateLanguageBasedOnCountry(selectedCountry);
    onCountryChange(selectedCountry);
    window.location.reload();
  }

  const changeDashboard = () => {
    if (access === 'both') {
      const newView = view === 'gold' ? '3ts' : 'gold';
      setView(newView);
      localStorage.setItem(`_dash`, newView);
      window.location.reload();
    }
  }

  // Function to get translated text
  const t = (key) => translations[lang][key] || key;

  // Get the list of other countries (excluding the currently selected one)
  const otherCountries = Object.keys(countries).filter(c => c !== country);

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {t('dashboard')} - {view.toUpperCase()}
              </div>
              <div id="google_translate_element"></div>
            </div> 	
            <ul className="navbar-nav header-right">
              <Dropdown as="li" className="nav-item header-profile">
                <Dropdown.Toggle as="a" variant="" className="nav-link i-false c-pointer">								
                  <img src={countries[country]} width="20" alt={country + " flag"}/>
                  <div className="header-info">
                    <span>{country}<i className="fa fa-caret-down ms-3" aria-hidden="true"></i></span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="right" className="mt-2">
                  {otherCountries.map((countryName) => (
                    <Dropdown.Item key={countryName} onClick={() => changeCountry(countryName)} className="dropdown-item ai-icon">
                      <img src={countries[countryName]} width="20" alt={countryName + " flag"} className="me-2" />
                      <span>{countryName}</span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item header-profile">
                <Dropdown.Toggle as="a" variant="" className="nav-link i-false c-pointer">								
                  <FontAwesomeIcon icon={icon({name: 'earth-americas'})} />
                  <span>{lang.toUpperCase()}</span>
                  <i className="fa fa-caret-down ms-2" aria-hidden="true"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="right" className="mt-2">
                  <Link to="" onClick={changeLanguage} className="dropdown-item ai-icon">
                    <span className="ms-2">{t(lang === 'en' ? 'FR' : 'EN')}</span>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item header-profile">
                <Dropdown.Toggle as="a" variant="" className="nav-link i-false c-pointer">								
                  <img src={user?.photoURL} width="20" alt=""/>
                  <div className="header-info">
                    <span>{user?.name} {user?.surname}<i className="fa fa-caret-down ms-3" aria-hidden="true"></i></span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="right" className="mt-2">
                  { access === 'both' && (
                    <Link to="/" onClick={changeDashboard} className="dropdown-item ai-icon">
                      <FontAwesomeIcon icon={icon({name: 'arrow-right-arrow-left'})} />
                      <span className="ms-2">{t('switchTo')} {view === 'gold' ? '3Ts' : 'Gold'}</span>
                    </Link>
                  )}
                  <LogoutPage logoutText={t('Logout')} />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;