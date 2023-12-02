import { useState } from 'react';

const Tracker = ({ user }) => {
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedDestination, setEditedDestination] = useState('');

  const handleEditDestination = (orderId, currentDestination) => {
    setEditingOrderId(orderId);
    setEditedDestination(currentDestination);
  };

  const handleSaveDestination = (orderId) => {
    fetch(`/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include",
      body: JSON.stringify({ destination: editedDestination }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        const updatedDestination = data.destination;

        setEditedDestination(updatedDestination);

         setEditingOrderId(null);
      })
      .catch((error) => {
        console.error('Error updating destination:', error);
      });
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Track your orders here</h1>
      {user && user.orders ? (
        <>
          <h1>{user.username}</h1>
          <table className="min-w-full bg-color-secondary border border-gray-300 mx-4 my-4">
            <thead className="text-start">
              <tr>
                <th className="py-2 px-4 text-left border-b">Name of Parcel</th>
                <th className="py-2 px-4 text-left border-b">Destination</th>
                <th className="py-2 px-4 text-left border-b">Status</th>
                <th className="py-2 px-4 text-left border-b">Weight</th>
                <th className="py-2 px-4 text-left border-b">Current Location</th>
                <th className="py-2 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr key={order.order_number}>
                  <td className="py-2 px-4 border-b">{order.name_of_parcel}</td>
                  <td className="py-2 px-4 border-b">
                    {order.status === 'pending' && editingOrderId === order.order_number ? (
                      <input
                        type="text"
                        value={editedDestination}
                        onChange={(e) => setEditedDestination(e.target.value)}
                      />
                    ) : (
                      order.destination
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">{order.weight}</td>
                  <td className="py-2 px-4 border-b">{order.current_location}</td>
                  <td className="py-2 px-4 border-b">
                    {order.status === 'pending' && (
                      <>
                        {editingOrderId === order.order_number ? (
                          <>
                            <button
                              onClick={() => handleSaveDestination(order.order_number)}
                              className="px-2 py-1 mr-2 bg-green-500 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleEditDestination(order.order_number, order.destination)
                            }
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            Edit Destination
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Session not created</p>
      )}
    </div>
  );
};

export default Tracker;
