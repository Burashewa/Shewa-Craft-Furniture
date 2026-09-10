import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Upload, MapPin, Phone, Building2, CheckCircle } from 'lucide-react';

const CHECKOUT_STEPS = ['Delivery', 'Payment', 'Confirm'];
const MAX_SCREENSHOT_BYTES = 10 * 1024 * 1024;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderRef] = useState(() => `ORD-${Date.now().toString().slice(-6)}`);

  const applyScreenshot = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, file: 'Please choose a PNG or JPG image.' }));
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setErrors((current) => ({ ...current, file: 'Image must be 10MB or smaller.' }));
      return;
    }
    setErrors((current) => ({ ...current, file: undefined }));
    setPaymentScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    applyScreenshot(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = {};
    if (!selectedBank) nextErrors.bank = 'Select a payment account.';
    if (!location.trim()) nextErrors.location = 'Enter your delivery address.';
    if (!phoneNumber.trim()) nextErrors.phone = 'Enter a phone number.';
    if (!paymentScreenshot) nextErrors.file = 'Upload a payment screenshot.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-900 text-white rounded-md flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Order submitted</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received. We will review your payment and process it shortly.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference</p>
              <p className="text-lg text-gray-900 mb-3">{orderRef}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order total</p>
              <p className="text-3xl text-gray-900">${total.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/orders"
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-200 text-center"
              >
                View orders
              </Link>
              <Link
                to="/products"
                onClick={onClose}
                className="w-full px-6 py-3 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-50 transition duration-200 text-center"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white border border-gray-200 shadow-xl rounded-xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Checkout</p>
              <h2 className="text-2xl text-gray-900">Complete your order</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5 text-gray-500 mx-auto" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6" noValidate>
            <ol className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {CHECKOUT_STEPS.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden className="text-gray-300">→</span>}
                  <span className={index === 0 ? 'text-gray-900' : ''}>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
                Order summary
              </h3>
              <div className="border border-gray-200 rounded-lg p-4">
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
                    onClick={() => {
                      setSelectedBank(bank.id);
                      setErrors((current) => ({ ...current, bank: undefined }));
                    }}
                    className={`p-4 border rounded-lg text-left transition ${
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
              {errors.bank ? (
                <p className="mt-2 text-sm text-rose-700">{errors.bank}</p>
              ) : null}
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <MapPin className="inline w-5 h-5 mr-2" />
                Delivery location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setErrors((current) => ({ ...current, location: undefined }));
                }}
                placeholder="Enter your full delivery address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              {errors.location ? (
                <p className="mt-2 text-sm text-rose-700">{errors.location}</p>
              ) : null}
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Phone className="inline w-5 h-5 mr-2" />
                Phone number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrors((current) => ({ ...current, phone: undefined }));
                }}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              {errors.phone ? (
                <p className="mt-2 text-sm text-rose-700">{errors.phone}</p>
              ) : null}
            </div>

            <div className="mb-6">
              <label className="block text-gray-900 mb-2">
                <Upload className="inline w-5 h-5 mr-2" />
                Upload payment screenshot *
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Payment screenshot"
                      className="max-h-48 mx-auto"
                    />
                    <div>
                      <p className="text-sm text-gray-900 mb-1">{paymentScreenshot?.name}</p>
                      <div className="flex items-center justify-center gap-4">
                        <label
                          htmlFor="screenshot-upload"
                          className="text-sm text-gray-900 hover:underline cursor-pointer"
                        >
                          Replace
                        </label>
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
                />
                {!previewUrl && (
                  <label
                    htmlFor="screenshot-upload"
                    className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200 cursor-pointer"
                  >
                    Choose file
                  </label>
                )}
              </div>
              {errors.file ? (
                <p className="mt-2 text-sm text-rose-700">{errors.file}</p>
              ) : null}
            </div>

            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-6">
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
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting…' : 'Submit order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
