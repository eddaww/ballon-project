import "../styles/ProductDetails.css";

export default function ProductDetails () {
  return (
    <div className="product-detail-container">
      <h2>Product details:</h2>
      <h3 className="feature">Feature:</h3>
      <ul className="feature-box">

        <li>Display balloons on the map</li>
        <li>Search balloons and show their flight tracks</li>
        <li>Search for locations</li>
        <li>Map controls</li>
        <li>Balloon popups with detailed information</li>

      </ul>
      <h3 className="possible-feature">Possible Add Feature: </h3>
      <ul className="possible-add-feature-box">

        <li>Add a button in popups to toggle or delete 24-hour flight tracks</li>
        <li>Integrate weather API for real-time weather data</li>
        <li>Automatically display the most recent balloon data (use 00, fallback to 01, 02... if needed)</li>
        <li>clear balloon track</li>
        
    </ul>
    </div>
  );

}