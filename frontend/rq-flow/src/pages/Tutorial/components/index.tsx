

const Tutorial = () => {
    const gifs = [
        {
            url: '/gifs/RQGen-tutorial-dragNdrop.gif',
            title: 'Drag and Drop to create initial thought nodes',
            description: 'You can drag and drop tag to create a new idea. You can also drag and drop the nodes to rearrange them.',
        },
        {
            url: '/gifs/RQGen-tutorial-initial1.gif',
            title: 'Write down your initial thoughts (1)',
            description: 'To start with, write down your initial thoughts in the initial thought node you created. Then right-click, or click the red button to see AI-generated RQs.',
        },
        {
            url: '/gifs/RQGen-tutorial-initial2.gif',
            title: 'Write down your initial thoughts (2)',
            description: 'These "initial thoughts" can take any forms, such as keywords, ideas, or even questions.',
        },
        {
            url: '/gifs/RQGen-tutorial-AIthoughts.gif',
            title: 'Click on Edges to see AI-generated thoughts',
            description: 'By click on the edges, you can see AI-generated thoughts based on AI agent"s reasoning.',
        },
        {
            url: '/gifs/RQGen-tutorial-literatureGraph.gif',
            title: 'Click on the generated RQ nodes to explore the literature graph',
            description: 'By clicking on the generated RQ nodes, you can explore the literature graph. You can also click on the literature nodes to see the paper details.',
        },
        {
            url: '/gifs/RQGen-tutorial-followupRQs.gif',
            title: 'Right-click RQ nodes to see more follow-up RQs',
            description: 'You can right-click on the RQ nodes to see more follow-up RQs. You can also provide your feedback to AI, but this is optional.',
        },
    ];


    return (
        <div className="bg-gray-100">
            <div className="w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-400 rounded-lg">
                        <div className="flex flex-col justify-center items-center h-full">
                            <div className="text-2xl font-bold">Tutorial: Research Question generation (RQ Gen)</div>
                            {gifs.length === 0 ? (
                                <div className="text-2xl font-medium">Coming soon...</div>
                            ) : (
                                gifs.map((gif, index) => (
                                    <div 
                                        key={index} 
                                        className="flex flex-col w-3/4 mb-6 justify-center items-center border-b-2 border-gray-400 pb-6"
                                    >
                                        <h3 className="text-2xl font-semibold mb-2">{(index + 1) + ": " + gif.title}</h3>
                                        <img src={gif.url} alt={gif.title} className="rounded mb-2 shadow-lg" />
                                        <p className="text-gray-600">{gif.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tutorial