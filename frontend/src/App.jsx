

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* El Dashboard lo haremos después */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/bitacora" element={<Bitacora />} />
      </Routes>
    </Router>
  );
}

export default App;
