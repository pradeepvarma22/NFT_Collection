// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  const tokenId = req.query.tokenId;


  const name = `crypto dev ${tokenId}`;
  const description = "cryptodevs nft"
  const img = 'https://static.remove.bg/remove-bg-web/3d75df900686714aa0c3f2ac38a019cdc089943e/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png'

  res.json({
    name: name,
    description: description,
    image: img
  });
}
