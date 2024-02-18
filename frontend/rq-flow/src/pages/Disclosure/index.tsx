import { Button, Card, Typography } from '@mui/material';
import exp from 'constants';

const ConsentForm = ({setSigned}) => {
    return (
        // <div className="w-full flex flex-col justify-center items-center space-y-6 p-4">
            <Card className="w-2/3 h-96 p-4 overflow-y-scroll shadow-lg mt-9 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <h1 className="text-2xl font-bold">Consent Form</h1>
                <h2 className="font-bold">Enhancing Creative for Learners and Researchers in Information Sciences through AI-Assisted Interfaces</h2>
                <p className="text-justify">
                    You are being asked to participate in a voluntary research study. The purpose of this study is to investigate the effectiveness of a new AI-generated research tool in the field of information science. Participating in this study will involve testing the tool and providing feedback on its usability and effectiveness. Your participation will last approximately one hour. Risks related to this research are minimal and include potential discomfort or frustration from using the tool. However, you are free to withdraw at any time if you experience any discomfort. Benefits related to this research include the opportunity to contribute to the development of a new tool that could facilitate the identification and development of novel research ideas. The alternative to participating in this study is to decline participation, in which case you will not have the opportunity to provide input on the development of the tool or its potential impact on the field of information science.
                </p>
                
                <h2 className="font-bold">What procedures are involved?</h2>
                <p className="text-justify">
                    The study procedures are as follows: you will be asked to interact with an AI-generated research tool and provide feedback on its usability and effectiveness. This will be done through an online meeting session, during which you will have the opportunity to use the tool and answer questions about your experience. Additionally, you may be asked to complete surveys related to your perceptions of AI-generated research ideas. Each session will last approximately 1.5 hours.
                </p>


                <h2 className="font-bold">Will my study-related information be kept confidential?</h2>
                <p className="text-justify">
                    But, when required by law or university policy, identifying information may be seen or copied by: a) The Institutional Review Board that approves research studies; b) The Office for Protection of Research Subjects and other university departments that oversee human subjects research; c) University and state auditors responsible for oversight of research; d) Federal regulatory agencies such as the Office of Human Research Protections in the Department of Health and Human Services; or e) National Science Foundation, the funder of this research.
                </p>

                <h2 className="font-bold">Will I be reimbursed for any expenses or paid for my participation in this research?</h2>
                <p>$20 per hour upon completing the user study.</p>

                <h2 className="font-bold">Can I withdraw or be removed from the study?</h2>
                <p className="text-justify">
                If you decide to participate, you are free to withdraw your consent and discontinue participation at any time. Your participation in this research is voluntary. Your decision whether or not to participate, or to withdraw after beginning participation, will not affect your current or future dealings with the University of Illinois at Urbana-Champaign. The researchers also have the right to stop your participation in this study without your consent if they believe it is in your best interests, you were to object to any future changes that may be made in the study plan. 
                </p>

                <h2 className="font-bold">Will data collected from me be used for any other research?</h2>
                <p>Your information will not be used or distributed for future use, even if identifiers are removed.</p>

                <h2 className="font-bold">Who should I contact if I have questions?</h2>
                <p>
                    Contact the researcher Yun Huang at the information given at the top if this form if you have any questions about this study or your part in it, or if you have concerns or complaints about the research.
                </p>

                <h2 className="font-bold">What are my rights as a research subject?</h2>
                <p className="text-justify">
                    If you have any questions about your rights as a research subject, including concerns, complaints, or to offer input, you may call the Office for the Protection of Research Subjects (OPRS) at 217-333-2670 or e-mail OPRS at irb@illinois.edu. If you would like to complete a brief survey to provide OPRS feedback about your experiences as a research participant, please follow the link here or through a link on the OPRS website: https://oprs.research.illinois.edu/. You will have the option to provide feedback or concerns anonymously or you may provide your name and contact information for follow-up purposes. 
                </p>

                <br />
                <br />

                <Typography variant="h6" className="font-bold">
                    <p>Please print this consent form if you would like to retain a copy for your records.</p>
                    <p>
                        I have read and understand the above consent form. I certify that I am 18 years old or older. By clicking the button below to enter the study, I indicate my willingness to voluntarily take part in this study.
                    </p>
                </Typography>

                <div className="flex justify-center">
                    <Button 
                        variant="contained" color="primary"
                        onClick={() => setSigned(true)}
                    >
                        Agree to the terms and conditions
                    </Button>
                </div>
            </Card>
        // </div>
    );
}

export default ConsentForm;