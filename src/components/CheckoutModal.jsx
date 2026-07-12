import { useState } from 'react';
import { X, Check, Upload, MapPin, Phone, Building2, CheckCircle } from 'lucide-react';

const bankAccounts = [
  {
    id: 1,
    bankName: 'Chase Bank',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 4532',
  },
  {
    id: 2,
    bankName: 'Bank of America',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 8291',
  },
  {
    id: 3,
    bankName: 'Wells Fargo',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 1047',
  },
  {
    id: 4,
    bankName: 'PayPal',
    accountName: 'payments@shewacraft.com',
    accountNumber: '',
  },
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

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-900 text-white flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Order submitted</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received. We will review your payment and process it shortly.
            </p>
            <div className="bg-gray-50 border border-gray-100 p-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order total</p>
              <p className="text-3xl text-gray-900">${total.toFixed(2)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white border border-gray-200 shadow-xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Checkout</p>
              <h2 className="text-2xl text-gray-900">Complete your order</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 border border-gray-200 hover:bg-gray-50 transition"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5 text-gray-500 mx-auto" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
                Order summary
              </h3>
              <div className="border border-gray-200 p-4">
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

            <div className="mb-6">
              <label className="block text-gray-900 mb-3">
                <Building2 className="inline w-5 h-5 mr-2" />
                Select payment account *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bankAccounts.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-4 border text-left transition ${
                      selectedBank === bank.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={selectedBank === bank.id ? 'text-white mb-1' : 'text-gray-900 mb-1'}>
                          {bank.bankName}
                        </p>
                        <p
                          className={`text-sm truncate ${
                            selectedBank === bank.id ? 'text-white/80' : 'text-gray-600'
                          }`}
                        >
                          {bank.accountName}
                        </p>
                        {bank.accountNumber && (
                          <p
                            className={`text-xs mt-1 ${
                              selectedBank === bank.id ? 'text-white/60' : 'text-gray-500'
                            }`}
                          >
                            {bank.accountNumber}
                          </p>
                        )}
                      </div>
                      {selectedBank === bank.id && (
                        <Check className="w-5 h-5 text-white shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <MapPin className="inline w-5 h-5 mr-2" />
                Delivery location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your full delivery address"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Phone className="inline w-5 h-5 mr-2" />
                Phone number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Upload className="inline w-5 h-5 mr-2" />
                Upload payment screenshot *
              </label>
              <div className="border border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Payment screenshot"
                      className="max-h-48 mx-auto"
                    />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">{paymentScreenshot?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentScreenshot(null);
                          setPreviewUrl(null);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Upload a payment confirmation image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                  required={!paymentScreenshot}
                />
                {!previewUrl && (
                  <label
                    htmlFor="screenshot-upload"
                    className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Choose file
                  </label>
                )}
              </div>
            </div>

            <div className="border border-gray-200 bg-gray-50 p-4 mb-6">
              <h4 className="text-sm text-gray-900 mb-2">Payment instructions</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Transfer the total amount to the selected account</li>
                <li>Upload a clear payment confirmation screenshot</li>
                <li>Add your delivery details</li>
                <li>Submit for verification</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Submit order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
