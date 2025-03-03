// src/options/Options.jsx
import Settings from './Settings';
import UserManager from './UsersManager';

const Options = () => {
  return (
    <div
      style={{
        padding: '1em',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100vh',
      }}>
      <div style={{ width: '50%', height: '100%' }}>
        <Settings />
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <UserManager />
      </div>
    </div>
  );
};
export default Options;
