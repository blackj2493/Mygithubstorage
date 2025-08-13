import NearbyAmenities from '../components/NearbyAmenities';

function ListingDetail({ listing }) {
  const [showAmenities, setShowAmenities] = useState(false);

  return (
    <div className="listing-detail">
      {/* ... existing listing details ... */}
      
      <button 
        className="btn btn-primary"
        onClick={() => setShowAmenities(!showAmenities)}
      >
        {showAmenities ? 'Hide Nearby Places' : 'Show Nearby Places'}
      </button>
      
      {showAmenities && (
        <NearbyAmenities
          address={listing.address}
          latitude={listing.latitude}
          longitude={listing.longitude}
        />
      )}
    </div>
  );
}

export default ListingDetail; 