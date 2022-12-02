import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "First Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Edificio_en_Baku%2C_Azerbaiy%C3%A1n%2C_2016-09-26%2C_DD_203.jpg/1116px-Edificio_en_Baku%2C_Azerbaiy%C3%A1n%2C_2016-09-26%2C_DD_203.jpg",
    address: "Coordinates: 48° 5′ 20.22″ N, 9° 12′ 52.06″ E",
    description: "this is a first meetup",
  },
  {
    id: "m2",
    title: "Second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Edificio_en_Baku%2C_Azerbaiy%C3%A1n%2C_2016-09-26%2C_DD_203.jpg/1116px-Edificio_en_Baku%2C_Azerbaiy%C3%A1n%2C_2016-09-26%2C_DD_203.jpg",
    address: "Coordinate: 48° 5′ 20.22″ N, 9° 12′ 52.06″ E",
    description: "recurring meeting",
  },
];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name='description' content='Browse a huge list of highly active React meetups'></meta>
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

/*
// getServerSideProps runs for every incoming request, so no need for revalidate
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  // fetch data from an API

  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}

*/

// this is better if you want to generate at set intervals - alternative to generating every time a new request is sent
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://znickerson85:Tr33hous3@cluster0.kvc2ysy.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  // always need to return an object here
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // allows for incremental static generation
    // number = number of seconds nextjs will wait before it regenerates teh page for an incoming request
    revalidate: 1,
  };
}

export default HomePage;
