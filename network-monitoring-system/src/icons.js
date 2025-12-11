// src/fontawesome.js or src/icons.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add entire packs to the library
library.add(fas, far, fab);

// Or selectively add icons for smaller bundle size
// import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
// library.add(faHouse, faUser);
