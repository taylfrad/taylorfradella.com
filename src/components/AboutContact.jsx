import {
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

export default function AboutContact() {

  return (
    <Box
      id="about"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "#ffffff",
        width: "100%",
        py: { xs: 8, md: 12 },
        px: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              textAlign: "center",
              mb: 3,
              color: "#222",
            }}
          >
            Let's Work Together.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              textAlign: "center",
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Have a project in mind? Let's create something amazing.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            href="mailto:taylor.fradella@selu.edu"
            sx={{
              bgcolor: "#e0e0e0",
              color: "#222",
              textTransform: "none",
              fontSize: { xs: "1rem", md: "1.1rem" },
              fontWeight: 500,
              px: { xs: 4, md: 5 },
              py: { xs: 1.5, md: 2 },
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#d0d0d0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            Contact Me
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}
