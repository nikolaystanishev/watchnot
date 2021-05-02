import React from 'react';

import { DatabaseConnectionProvider } from './src/db/connection';
import { Navigation } from './src/components/navigation';


export default function App() {
  return (
    <DatabaseConnectionProvider>
      <Navigation />
    </DatabaseConnectionProvider>
  );
}
