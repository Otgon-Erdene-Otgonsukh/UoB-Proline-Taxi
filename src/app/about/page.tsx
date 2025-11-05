// MUI Icons chosen from list
import { Info, RateReview, Assignment, CheckCircle, Sms, DirectionsCar } from '@mui/icons-material';

    export default function AboutPage() {
    return (
        <main className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Left hand side of page on md screen. */}
        <div className="md:w-3/5 flex flex-col items-center justify-center">
            <div className="shadow-lg rounded-md w-full h-full p-15 m-5 mb-5">
            <div className="flex flex-col items-center">
                <Info sx={{fontSize: 60}} /><br/>
                <h1 className="text-3xl font-bold text-gray-800">Proline Taxi | University of Bristol</h1>
            </div>
            <p className="text-lg text-gray-600">This service, in partnership with Proline Taxi, aims to streamline the taxi booking process by automating the processes from requesting, approving, and even merging taxi services together. The platform also provides automated invoicing to simplify finances and clarify billing for your departments.</p>
            </div>

            <div className="shadow-lg rounded-md w-full h-full m-5 p-15">
            <div className="flex flex-col items-center">
                <RateReview sx={{fontSize: 60}} /><br/>
                <h1 className="text-3xl font-bold">Check out proline taxi Reviews</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="rounded-md border p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">John Doe</h3>
            </div>
            <p className="text-gray-600">Great experience.</p>
            </div>
        </div>
            </div>
        </div>

        {/* Right hand side of page on md screen. */}
        <div className="md:w-2/5 flex items-center justify-center shadow-lg m-5 rounded-md">
            <div className="text-center w-full">
            <div className="items-center">
                <h1 className="text-3xl font-bold mb-15">BOOKING MADE EASY</h1>
            </div>
            <div className="flex flex-col text-cneter">
                <div className="items-start mb-10">
                <Assignment sx={{fontSize: 60}} /><br/>
                <p className="text-lg font-bold">1. Fill in the booking form</p>
                </div>

                <div className="items-start mb-10">
                <CheckCircle sx={{fontSize: 60}} /><br/>
                <p className="text-lg font-bold">2. Get approval</p>
                </div>

                <div className="items-start mb-10">
                <Sms sx={{fontSize: 60}} /><br/>
                <p className="text-lg font-bold">3. Receive confirmation and details via SMS</p>
                </div>

                <div className="items-start mb-10">
                <DirectionsCar sx={{fontSize: 60}} /><br/>
                <p className="text-lg font-bold">4. Off you go!</p>
                </div>
            </div>
            </div>
        </div>
        </main>
    );
    }
