/* eslint-disable no-undef */


export default function ProtectedRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAdmin = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/auth/check-admin', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };
  
      checkAdmin();
    }, [navigate]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return isAdmin ? children : <Navigate to="/login" />;
  }