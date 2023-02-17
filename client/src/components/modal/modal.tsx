export default function Modal() {
  return (
    <div
      style={{
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100vw',
        height: '100vh',
        top: '0',
        left: '0',
        zIndex: '100',
      }}
    >
      <div></div>
    </div>
  );
}
