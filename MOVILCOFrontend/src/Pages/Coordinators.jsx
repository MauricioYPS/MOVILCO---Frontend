export default function Coordinators() {
    return (<>
        <main className="w-full min-h-screen h-screen border-2 border-blue-600">


            <section id="PCView" className=" w-full h-full ">
                <section id="Tittle" className="w-full border-2 h-[10%] border-amber-500 ml-10">
                    <h1 className="text-4xl font-semibold">Directorio de Coordinadores</h1>
                    <h2 className=" text-2xl text-gray-700">Supervisa el rendimiento de los coordinadores en tu distrito.</h2>
                </section>
                <section id="stats" className="w-full border-2 h-[17%] flex">
                    <div className="w-[30%] h-full flex  ml-10 items-center justify-between">
                        <div id="SearchBar" className="w-[78%] h-[40%] border-2">

                        </div>
                        <div id="filters" className=" w-[13%] h-[35%] border-2">

                        </div>
                    </div>
                    <div className="w-[70%] h-full flex justify-around items-center ">
                        <div id="TotalCoordinators" className="border-2 w-[20%] h-[80%]">

                        </div>
                        <div id="TotalAdvisors" className="border-2 w-[20%] h-[80%]">

                        </div>
                        <div id="BetterCompliance" className="border-2 w-[20%] h-[80%]">

                        </div>
                        <div id="WorseCompliance" className="border-2 w-[20%] h-[80%]">
                        </div>


                    </div>
                </section>
                <section id="CordinatorsList" className="w-full h-[73%] border-2 border-red-500">

                </section>

            </section>

        </main>








    </>)
}