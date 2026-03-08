import React from 'react';
import BreadCrumbs from '../components/Breadcums';
import ContactForm from '../components/ContactForm';
import { Phone } from 'lucide-react';
import psychologyimg from '../assets/psychology.jpg';

const ClinicalPsychology = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Specialities', href: '/specialities' },
    { label: 'Clinical Psychology' }
  ];

  return (
    <div className="min-h-screen bg-lightbg">
      <BreadCrumbs items={breadcrumbItems} headText="Clinical Psychology" />

      {/* Hero Image Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <img 
          src={psychologyimg} 
          alt="Clinical Psychology" 
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Second Opinion Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Second Opinion</h2>
              
              <h3 className="text-xl font-semibold text-darktext mb-3">For Friends and Family:</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Mental health concerns remain highly misunderstood in our society, leading to fear and stigma 
                  surrounding these conditions. This lack of understanding has also contributed to a dearth of 
                  knowledge about various mental health issues, including stress, anxiety, and depression. As 
                  friends and family members, providing support to someone experiencing these challenges requires 
                  not only love and understanding but also the right information and approach.
                </p>
                <p>
                  It's essential to approach the situation with sensitivity, as even the most well-meaning gestures 
                  of enthusiasm and affection can inadvertently be perceived as hostile or intrusive. Patience and 
                  acceptance are invaluable gifts you can offer to your loved one during their difficult time.
                </p>
                <p>
                  One of the most effective ways to care for someone dealing with stress, anxiety, or depression is 
                  by encouraging them to seek psychological therapy. Psychological therapy serves as a roadmap for 
                  psychologists to comprehend the patient's unique struggles and to identify potential solutions 
                  through regular interactions. These therapies encompass various approaches such as behavioral, 
                  cognitive, psychodynamic, and humanistic therapies.
                </p>
                <p>
                  The primary goal of psychological therapy is to enhance an individual's overall well-being and 
                  mental health. By addressing problematic behaviors, beliefs, compulsions, thoughts, or emotions, 
                  these therapeutic methods aim to help the individual change and overcome their difficulties 
                  effectively. Furthermore, psychological therapy can improve their social interactions and overall 
                  functioning.
                </p>
                <p>
                  Once you encourage your loved one to seek professional help and offering your unwavering support, 
                  you can help them in moving ahead towards better mental health and well-being. Remember, your 
                  understanding and empathy can make a world of difference in their recovery process.
                </p>
              </div>
            </section>

            {/* Psychological Therapies */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Various Psychological Therapies/Counseling</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Behaviour Therapy:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Behaviour therapy is a form of psychotherapy focused on modifying unhealthy behaviours and 
                    reinforcing positive ones. Therapists use techniques like exposure therapy and systematic 
                    desensitization to treat phobias and anxiety disorders. By identifying triggers and implementing 
                    behavioural strategies, clients can develop healthier coping mechanisms. Behaviour therapy aims 
                    to foster lasting changes through a collaborative, goal-oriented approach.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Cognitive Behaviour Therapy (CBT):</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cognitive Behaviour Therapy combines cognitive and behavioural approaches to address psychological 
                    issues. It helps clients understand thought patterns that influence emotions and behaviour. By 
                    challenging negative beliefs and adopting healthier cognitive strategies, individuals can manage 
                    anxiety, depression, and other mental health challenges. CBT is evidence-based and empowers 
                    clients to be active participants in their therapeutic journey.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Family Therapy/Family Counselling:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Family therapy focuses on resolving conflicts and improving communication within families. It 
                    aims to strengthen relationships, enhance understanding, and promote positive dynamics. Therapists 
                    work with all family members, exploring their roles and interactions to identify patterns that may 
                    contribute to issues. By fostering empathy and cooperation, family therapy facilitates healthy 
                    resolutions and strengthens family bonds.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Pre-Marital Counselling:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Pre-marital counselling prepares couples for marriage by addressing potential challenges and 
                    enhancing relationship skills. Therapists discuss communication, financial management, conflict 
                    resolution, and other essential aspects of a successful partnership. Couples learn to express 
                    needs effectively and develop strategies to maintain a strong and resilient relationship throughout 
                    their marriage.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Marriage Counselling:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Marriage counselling helps couples navigate challenges, resolve conflicts, and deepen their 
                    emotional connection. Therapists create a safe space for open communication, addressing individual 
                    and shared concerns. By fostering empathy and understanding, couples can rebuild trust, improve 
                    intimacy, and strengthen their marital bond.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Therapy for Sexual Disorders:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Therapy for sexual disorders involves addressing issues like erectile dysfunction, premature 
                    ejaculation, and low libido. Therapists explore physical and psychological factors contributing 
                    to the problem. Treatment may include cognitive-behavioural techniques, communication skills 
                    training, and sensate focus exercises. This specialized therapy aims to improve sexual function 
                    and enhance overall sexual satisfaction.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Individual Counselling:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Individual counselling provides one-on-one support and guidance for personal growth and emotional 
                    well-being. Therapists help clients explore their feelings, thoughts, and behaviours, working 
                    through challenges such as anxiety, depression, trauma, and life transitions. Through a trusting 
                    therapeutic relationship, individuals can gain insight, develop coping skills, and achieve positive 
                    changes in their lives.
                  </p>
                </div>
              </div>
            </section>

            {/* Psychiatry Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Psychiatry</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Psychiatry, a branch of medicine dedicated to understanding and addressing mental health disorders, 
                plays a crucial role in enhancing the overall well-being of individuals.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Psychiatrists come across a multitude of issues spanning from mood disorders such as depression, 
                bipolar disorder, anxiety disorders, schizophrenia, and personality disorders. Each patient brings 
                a unique set of circumstances and symptoms, necessitating personalized assessments and treatment plans. 
                With its psychiatry department, Venkateshwar Hospital aims to extend psychiatric support to patients 
                with a combination of therapeutic interventions and medical treatments to help patients manage their 
                conditions effectively.
              </p>
            </section>

            {/* Therapies and Treatments */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Therapies and Treatments</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Cognitive Behavioural Therapy (CBT):</h3>
                  <p className="text-gray-700 leading-relaxed">
                    This widely used psychotherapy aims to identify and modify negative thought patterns and behaviour 
                    contributing to mental health issues. CBT equips patients with coping strategies to deal with 
                    challenges and stressors.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Medication Management:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Psychiatrists often prescribe medications to alleviate symptoms and stabilize mood. These may 
                    include antidepressants, antipsychotics, anxiolytics, and mood stabilizers. Monitoring and 
                    adjusting medications is a critical aspect of treatment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Dialectical Behaviour Therapy (DBT):</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Primarily used for borderline personality disorder and self-harming behaviours, DBT teaches 
                    patients mindfulness, emotional regulation, interpersonal effectiveness, and distress tolerance 
                    skills.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Group Therapy:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Group sessions provide a supportive environment where patients can share their experiences, learn 
                    from one another, and practice interpersonal skills under the guidance of a trained therapist.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Electroconvulsive Therapy (ECT):</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In cases of severe depression or certain forms of schizophrenia, ECT may be considered. This 
                    controlled procedure involves inducing a brief seizure through electrical currents to alleviate 
                    symptoms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Family Therapy:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mental health issues often impact the entire family. Family therapy involves sessions where family 
                    members learn to communicate effectively, understand the patient's struggles, and provide 
                    constructive support.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Psychodynamic Therapy:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Focused on uncovering unconscious patterns and unresolved conflicts, psychodynamic therapy aims 
                    to provide insight into the root causes of mental health issues.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-darktext mb-2">Eye Movement Desensitization and Reprocessing (EMDR) therapy:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    This form of therapy has emerged as a valuable approach to alleviate psychological distress. 
                    Particularly potent in treating trauma, notably post-traumatic stress disorder (PTSD), EMDR has 
                    emerged as a successful method for mitigating its effects.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                By and large the psychiatrists at Venkateshwar Hospital adapt their approaches to suit each patient's 
                unique needs. A combination of therapies is often employed to address the complex interplay of 
                biological, psychological, and social factors contributing to mental health disorders. The psychiatrist's 
                role extends beyond diagnosis and treatment – they provide empathy, a safe space, and a guiding hand 
                on the path to recovery.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                In essence, psychiatry is a compassionate approach towards dealing with mental health challenges and 
                the psychiatrists also tackle the challenges by integrating a wide range of therapies and treatments. 
                Through their expertise and dedication, psychiatrists empower individuals to regain control of their 
                lives, fostering hope and healing in the midst of mental health struggles.
              </p>
            </section>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Quick Contact Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-darktext">Quick Contact</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Need immediate assistance? Call us now or fill the form below.
                </p>
                <a 
                  href="tel:+1234567890" 
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
                >
                  Call: +123-456-7890
                </a>
              </div>

              {/* Contact Form */}
              <ContactForm type="contact" compact={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalPsychology;
