import React, { useState } from "react";
import {
  Container,
  Grid,
  Text,
  Heading,
  Flex,
  Card,
  Button,
  Spinner,
  TextField,
  Callout,
  Link,
} from "@radix-ui/themes";

const REPLICATE_PROXY = "https://replicate-api-proxy.glitch.me";
const [W, H] = [512, 384];

const GREETINGS = [
  "Merry Christmas",
  "Thinking of you",
  "Happy Birthday",
  "Happy Holidays",
  "Happy New Year",
  "Happy Valentine's Day",
  "Happy Easter",
  "Happy Halloween",
  "Happy Thanksgiving",
  "Happy Hanukkah",
  "Hope you’re doing okay",
  "Just because",
  "Sending you love",
  "Get well soon",
  "Miss you",
  "From me to you",
  "Thank you",
  "Congratulations",
  "Good luck",
  "I’m sorry",
  "Happy Anniversary",
  "Happy Mother’s Day",
  "Happy Father’s Day",
  "Happy Pride",
  "Happy Graduation",
  "Never contact me again",
  "I’m breaking up with you",
  "We’re engaged",
];

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SUGGESTED_SEARCHES = {
  "dogs with heart eyes": "pink",
  "Christmas horses": "red",
  "frolicking horses": "orange",
  "sunflower fields": "yellow",
  "forest fire": "green",
  "sad penguins": "blue",
  "winter wonderland": "indigo",
  "lavendar fields at sunset": "violet",
  "cute kitties": "brown",
};

export async function getAIImage(prompt, width, height) {
  const data = {
    // Playground AI model
    version: "a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
    input: {
      prompt,
      width,
      height,
      format: "jpg",
    },
  };
  let url = REPLICATE_PROXY + "/create_n_get/";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.error || res.output?.length == 0) {
        console.error("Something went wrong");
        return res.error || null;
      } else {
        let imageURL = res.output[0];
        return imageURL;
      }
    })
    .catch((err) => {
      // activate parent promise's catch block by throwing an error
      throw new Error(err);
    });
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([
    // "https://replicate.delivery/yhqm/K3NxmNGglULeHap1J82PnMoxclQ11jeDXfkWiJ3ne2t2oI4OB/out-0.png",
    // "https://replicate.delivery/yhqm/J8XBelCteLrzmkrhKGZHpfFV7fHSsMMlsPeqFwZwlJkEyvudC/out-0.png",
  ]);
  const [captions, setCaptions] = useState([]);

  return (
    <Flex direction="column" gap="7" pt="8" pb="6" px="3" align="center">
      <Container size="2" className="print-hide">
        <Flex direction="column" gap="5">
          <Text
            color="brown"
            size="5"
            align="center"
            style={{ fontFamily: "papyrus" }}
          >
            <Link href="https://lachlanjc.com" color="brown">
              @lachlanjc
            </Link>
            ’s
          </Text>
          <Heading
            size="9"
            as="h1"
            align="center"
            weight="regular"
            style={{ fontFamily: "Papyrus, serif" }}
          >
            Junk Mail Generator
          </Heading>

          <Flex direction="row" align="center" gap="3">
            <TextField.Root
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              placeholder="Prompt photos of anything…"
              size="3"
              variant="classic"
              style={{ width: "100%" }}
            />
            <Button
              type="submit"
              size="3"
              onClick={() => {
                setIsGenerating(true);
                setImages([null, null, null, null]);
                setCaptions(["…", "…", "…", "…"]);
                setError(null);
                setTimeout(() => {
                  setCaptions([
                    `${sample(GREETINGS)} :)`,
                    `${sample(GREETINGS)}!`,
                    `${sample(GREETINGS)}! We didn’t draw this`,
                    `${sample(GREETINGS)}. (${prompt.endsWith("s") ? "these aren’t" : "it’s not"} real btw)`,
                  ]);
                }, 750);
                Promise.all([
                  getAIImage(`high detail photorealistic ${prompt}`, W, H),
                  getAIImage(
                    `screenprint-style illustration of ${prompt}`,
                    W,
                    H,
                  ),
                  getAIImage(`watercolor drawing of ${prompt}`, W, H),
                  getAIImage(`hand-painted illustration of ${prompt}`, W, H),
                ])
                  .then((urls) => {
                    setImages(urls);
                    setIsGenerating(false);
                  })
                  .catch((err) => {
                    console.error(err);
                    setIsGenerating(false);
                    setError(err);
                  });
              }}
              aria-busy={isGenerating}
              style={{ width: 94 }}
              variant="classic"
            >
              {isGenerating ? <Spinner /> : "Generate"}
            </Button>
          </Flex>
          <Flex gap="2" wrap="wrap" justify="center">
            {Object.keys(SUGGESTED_SEARCHES).map((topic) => (
              <Button
                variant="soft"
                radius="full"
                size="2"
                color={SUGGESTED_SEARCHES[topic]}
                onClick={() => setPrompt(topic)}
                key={topic}
              >
                {topic}
              </Button>
            ))}
          </Flex>
          {error && (
            <Callout.Root color="red" role="alert">
              <Callout.Text>{error.toString()}</Callout.Text>
            </Callout.Root>
          )}
        </Flex>
      </Container>
      <Container size="4">
        <Grid
          columns={{ initial: "1", md: "2" }}
          gap={{ initial: "3", md: "5" }}
          className="cards"
        >
          {images.map((url, i) => (
            <Card key={url + i} className="printable" variant="classic">
              <img src={url} alt="" width={W} height={H} />
              <Text as="p" size="5" contentEditable>
                {captions[i]}
              </Text>
            </Card>
          ))}
        </Grid>
        <footer className="print-hide">
          {images.filter(Boolean).length > 0 && (
            <Flex
              direction="row"
              justify="between"
              wrap="wrap"
              gap="3"
              pt="5"
              align="center"
              className="print-hide"
            >
              <Text color="brown" size="2">
                Click captions to edit
              </Text>
              <Button variant="classic" onClick={() => window.print()}>
                Print all
              </Button>
            </Flex>
          )}
        </footer>
      </Container>
    </Flex>
  );
}
