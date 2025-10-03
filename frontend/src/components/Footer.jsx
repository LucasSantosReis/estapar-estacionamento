import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M48.9557 21.2441C48.9557 23.8608 50.3583 25.1295 53.2504 25.1295H59.1359V22.6786H53.5179C52.419 22.6786 51.9345 22.2605 51.9345 21.3162V20.9197H58.7888V18.613H51.9345V16.9839H59.1648V14.533H48.9701L48.9557 21.2441Z" fill="currentColor"></path>
                <path d="M15.4364 0C13.7637 -1.09204e-06 12.1594 0.663771 10.976 1.84551C9.79254 3.02726 9.12673 4.63031 9.12482 6.3025V18.2441H6.43428C4.72839 18.246 3.0929 18.9243 1.88666 20.1302C0.68042 21.3361 0.00190922 22.971 0 24.6764V40H6.24673C7.95136 39.9962 9.58495 39.3171 10.7896 38.1114C11.9943 36.9057 12.6718 35.2718 12.6737 33.5677V21.7992H33.013C34.6666 21.7973 36.2518 21.1392 37.4203 19.9697C38.5889 18.8001 39.2453 17.2146 39.2453 15.5616V0H15.4364ZM9.13204 33.5821C9.13204 34.3471 8.82805 35.0808 8.28695 35.6217C7.74585 36.1627 7.01196 36.4666 6.24673 36.4666H3.54897V24.6692C3.54897 23.9042 3.85295 23.1705 4.39405 22.6296C4.93515 22.0886 5.66904 21.7847 6.43428 21.7847H9.12482L9.13204 33.5821ZM35.6964 15.5544C35.6964 16.2646 35.4146 16.9458 34.913 17.4486C34.4113 17.9515 33.7306 18.235 33.0202 18.2369H12.681V6.28808C12.6829 5.55876 12.974 4.85994 13.4906 4.34491C14.0071 3.82987 14.7069 3.54065 15.4364 3.54066H35.6964V15.5544Z" fill="url(#paint0_linear_369_177)"></path>
                <path d="M73.3619 19.1744C72.7212 18.9753 72.0693 18.8141 71.4097 18.6914C70.9252 18.5905 70.477 18.5256 70.0431 18.4535C69.3648 18.3858 68.6986 18.2282 68.0621 17.985C67.5993 17.7471 67.5994 17.502 67.5994 17.4227C67.5994 16.9037 68.2645 16.637 69.5804 16.637C71.1582 16.6398 72.7321 16.7943 74.2801 17.0983L74.6127 17.1704V14.8204L74.4102 14.7772C72.9644 14.4238 71.4812 14.2447 69.9926 14.2437C66.6233 14.2437 64.6928 15.4548 64.6928 17.5669C64.7037 18.2105 64.9303 18.8319 65.3365 19.3322C65.7426 19.8325 66.3051 20.183 66.9341 20.3277C67.5721 20.5275 68.2216 20.6888 68.8791 20.8107C69.2984 20.89 69.7106 20.9549 70.1082 21.0198C71.4603 21.2288 72.6316 21.409 72.6316 21.9929C72.6316 22.4686 72.3135 23.0093 69.8335 23.0093C68.3133 23.0436 66.8009 22.7841 65.3797 22.2452L64.9892 22.0794V24.6744L65.1772 24.7321C66.6942 25.1886 68.2706 25.4194 69.8552 25.4169C71.3196 25.4981 72.7794 25.1896 74.0849 24.5231C74.5544 24.2616 74.9441 23.8782 75.2127 23.4137C75.4813 22.9492 75.6187 22.4209 75.6104 21.8848C75.5968 21.2465 75.3673 20.6315 74.9592 20.1395C74.551 19.6475 73.9882 19.3074 73.3619 19.1744Z" fill="currentColor"></path>
                <path d="M79.6758 16.9815H84.1513V25.1271H87.1374V16.9815H91.49L91.5045 14.5378H79.6758V16.9815Z" fill="currentColor"></path>
                <path d="M98.9384 14.5375L93.3639 25.1268H96.6103L100.204 17.702L103.79 25.1268H107.116L101.541 14.5375H98.9384Z" fill="currentColor"></path>
                <path d="M121.457 15.5114C120.326 14.7906 118.994 14.4473 117.654 14.5311H111.797V25.1276H114.791V22.4172H117.683C119.022 22.4996 120.353 22.1591 121.486 21.444C121.916 21.0779 122.262 20.6231 122.499 20.111C122.736 19.5989 122.858 19.0417 122.858 18.4777C122.858 17.9138 122.736 17.3565 122.499 16.8444C122.262 16.3323 121.916 15.8775 121.486 15.5114H121.457ZM119.866 18.4741C119.866 19.8005 118.478 19.9951 117.654 19.9951H114.762V16.9531H117.654C118.666 16.9531 119.866 17.2198 119.866 18.4741Z" fill="currentColor"></path>
                <path d="M153.524 21.7271C154.175 21.4573 154.725 20.9894 155.093 20.3901C155.462 19.7907 155.632 19.0906 155.578 18.3896C155.578 15.9026 153.785 14.533 150.516 14.533H144.27V25.1295H147.263V22.2461H150.582L152.454 25.1295H156.011L153.524 21.7271ZM152.635 18.3896C152.635 19.6583 151.464 19.925 150.466 19.925H147.248V16.9407H150.466C151.449 16.9407 152.635 17.1929 152.635 18.3896Z" fill="currentColor"></path>
                <path d="M131.395 14.5378L125.821 25.1271H129.067L132.653 17.7023L136.239 25.1271H139.565L133.991 14.5378H131.395Z" fill="currentColor"></path>
                <defs>
                  <linearGradient id="paint0_linear_369_177" x1="39.2453" y1="-0.0000377744" x2="-0.907229" y2="0.932386" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#70D44B"></stop>
                    <stop offset="1" stopColor="#74E0C1"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/estapar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9m0 7.5a3 3 0 1 1 0-5.999A3 3 0 0 1 12 15m4.5-12.75h-9A5.256 5.256 0 0 0 2.25 7.5v9a5.256 5.256 0 0 0 5.25 5.25h9a5.256 5.256 0 0 0 5.25-5.25v-9a5.256 5.256 0 0 0-5.25-5.25m3.75 14.25a3.75 3.75 0 0 1-3.75 3.75h-9a3.75 3.75 0 0 1-3.75-3.75v-9A3.75 3.75 0 0 1 7.5 3.75h9a3.75 3.75 0 0 1 3.75 3.75zM18 7.125a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0"></path>
                </svg>
              </a>
              <a href="https://www.facebook.com/Estapar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2.25A9.75 9.75 0 1 0 21.75 12 9.76 9.76 0 0 0 12 2.25m.75 17.965V14.25H15a.75.75 0 1 0 0-1.5h-2.25V10.5a1.5 1.5 0 0 1 1.5-1.5h1.5a.75.75 0 1 0 0-1.5h-1.5a3 3 0 0 0-3 3v2.25H9a.75.75 0 1 0 0 1.5h2.25v5.965a8.25 8.25 0 1 1 1.5 0"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/estapar/?originalSubdomain=br" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20.25 2.25H3.75a1.5 1.5 0 0 0-1.5 1.5v16.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V3.75a1.5 1.5 0 0 0-1.5-1.5m0 18H3.75V3.75h16.5zM9 10.5v6a.75.75 0 1 1-1.5 0v-6a.75.75 0 1 1 1.5 0m8.25 2.625V16.5a.75.75 0 1 1-1.5 0v-3.375a1.875 1.875 0 1 0-3.75 0V16.5a.75.75 0 1 1-1.5 0v-6a.75.75 0 0 1 1.48-.167 3.375 3.375 0 0 1 5.27 2.792m-7.875-5.25a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0"></path>
                </svg>
              </a>
              <a href="https://www.tiktok.com/discover/estapar-estacionamento" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 6.75a4.505 4.505 0 0 1-4.5-4.5.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75v12.375a1.875 1.875 0 1 1-2.678-1.695.75.75 0 0 0 .428-.678V8.25a.75.75 0 0 0-.881-.739c-3.346.596-5.869 3.655-5.869 7.114a7.125 7.125 0 1 0 14.25 0v-3.723A9.7 9.7 0 0 0 21 12a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75m-.75 3.716a8.2 8.2 0 0 1-4.062-1.514.75.75 0 0 0-1.188.61v5.063a5.625 5.625 0 1 1-11.25 0c0-2.428 1.56-4.606 3.75-5.4v2.594a3.374 3.374 0 1 0 5.25 2.806V3h2.297a6.01 6.01 0 0 0 5.203 5.203z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">/ Soluções</h3>
            <ul className="space-y-3">
              <li><a href="https://www.estapar.com.br/paraquemdirige" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Para quem dirige</a></li>
              <li><a href="https://www.estapar.com.br/paraempresas" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Para empresas</a></li>
              <li><a href="https://www.estapar.com.br/paracidades" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Para cidades</a></li>
              <li><a href="https://www.estapar.com.br/marcasparceiras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Marcas parceiras</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">/ Institucional</h3>
            <ul className="space-y-3">
              <li><a href="https://www.estapar.com.br/sobreaestapar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Sobre a Estapar</a></li>
              <li><a href="https://www.estapar.com.br/trabalhenaestapar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Trabalhe na Estapar</a></li>
              <li><a href="https://www.estapar.com.br/imprensa" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Imprensa</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li><a href="https://www.estapar.com.br/novidades" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Novidades</a></li>
              <li><a href="https://www.estapar.com.br/investidores" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Investidores</a></li>
              <li><a href="https://www.estapar.com.br/contato" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© Copyright 2025. Todos os direitos reservados.</p>
            <a href="https://site.estapar.com.br/sites/default/files/politica_de_privacidade_estapar.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">Política de privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer