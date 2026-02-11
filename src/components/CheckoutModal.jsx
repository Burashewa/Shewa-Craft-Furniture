import { useState } from 'react';
import { X, Check, Upload, MapPin, Phone, Building2, CheckCircle } from 'lucide-react';

const bankAccounts = [
  {
    id: 1,
    bankName: 'Chase Bank',
    accountName: 'FURNISH LLC',
    accountNumber: '**** **** **** 4532',
    icon: '🏦'
  },
  {
    id: 2,
    bankName: 'Bank of America',
    accountName: 'FURNISH LLC',
    accountNumber: '**** **** **** 8291',
    icon: '🏦'
  },
  {
    id: 3,
    bankName: 'Wells Fargo',
    accountName: 'FURNISH LLC',
    accountNumber: '**** **** **** 1047',
    icon: '🏦'
  },
  {
    id: 4,
    bankName: 'PayPal',
    accountName: 'furnish@payments.com',
    accountNumber: '',
    icon: '💳'
  }
];

export function CheckoutModal({ cartItems, total, onClose }) {
  const [selectedBank, setSelectedBank] = useState(null);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedBank || !location || !phoneNumber || !paymentScreenshot) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate order submission
    setIsSubmitted(true);
    
    // In a real application, you would send this data to your backend
    console.log({
      selectedBank: bankAccounts.find(b => b.id === selectedBank),
      location,
      phoneNumber,
      paymentScreenshot: paymentScreenshot.name,
      cartItems,
      total
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-in fade-in duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Order Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received. The owner will review your payment and process your order shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-3xl text-gray-900">${total.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a confirmation message once your payment has been verified.
            </p>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl text-gray-900">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 mb-3">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3 mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-xl text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bank Account Selection */}
            <div className="mb-6">
              <label className="block text-gray-900 mb-3">
                <Building2 className="inline w-5 h-5 mr-2" />
                Select Payment Account *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bankAccounts.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      selectedBank === bank.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{bank.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 mb-1">{bank.bankName}</p>
                        <p className="text-sm text-gray-600 truncate">{bank.accountName}</p>
                        {bank.accountNumber && (
                          <p className="text-xs text-gray-500 mt-1">{bank.accountNumber}</p>
                        )}
                      </div>
                      {selectedBank === bank.id && (
                        <Check className="w-5 h-5 text-gray-900 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <MapPin className="inline w-5 h-5 mr-2" />
                Delivery Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your full delivery address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide complete address including street, city, state, and ZIP code
              </p>
            </div>

            {/* Phone Number Input */}
            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Phone className="inline w-5 h-5 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll contact you for delivery coordination
              </p>
            </div>

            {/* Payment Screenshot Upload */}
            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Upload className="inline w-5 h-5 mr-2" />
                Upload Payment Screenshot *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Payment screenshot"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">{paymentScreenshot?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentScreenshot(null);
                          setPreviewUrl(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                  required
                />
                {!previewUrl && (
                  <label
                    htmlFor="screenshot-upload"
                    className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                  >
                    Choose File
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please upload a clear screenshot of your payment confirmation
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm text-blue-900 mb-2">Payment Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Transfer the total amount to the selected bank account</li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>Upload the screenshot above</li>
                <li>Complete your delivery information</li>
                <li>Submit your order for verification</li>
              </ol>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Submit Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}